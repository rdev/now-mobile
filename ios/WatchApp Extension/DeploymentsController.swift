// Deployments controller also dubs as the WatchConnectivity session delegate
// because it's the first controller anyway and I didn't think of a better place to put WC logic

import WatchKit
import Foundation
import WatchConnectivity
import Alamofire
import SwiftyJSON

class DeploymentsController: WKInterfaceController, WCSessionDelegate {
  @IBOutlet var deploymentsTable: WKInterfaceTable!
  @IBOutlet var contentGroup: WKInterfaceGroup!
  @IBOutlet var loginNotice: WKInterfaceGroup!
  @IBAction func refresh() {
    self.loadDeployments()
  }

  var session: WCSession?
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
    self.setTitle("Now")

    // Initialize WC session
    if WCSession.isSupported() {
      print("Activating watch session")
      self.session = WCSession.default
      self.session?.delegate = self
      self.session?.activate()
    }
  }

  override func willActivate() {
    // This is called when watch view controller is about to be visible to user. Basically componentWillMount
    super.willActivate()
    let delegate = WKExtension.shared().delegate as! ExtensionDelegate

    // Login notice if there's no token
    if delegate.TOKEN == nil {
      self.showLoginNotice()
      return
    }

    // Let's show data from cache first if we have any. If not, abort mission and start loading
    guard let cachedDeployments = UserDefaults.standard.string(forKey: "lastDeployments") else {
      self.loadDeployments()
      return
    }
    let cacheTime = UserDefaults.standard.double(forKey: "deploymentsTimestamp")

    do {
      let dataFromString = cachedDeployments.data(using: .utf8, allowLossyConversion: false)
      let data = try JSON(data: dataFromString!)
      print("Loading deployments from cache")
      self.handleDeployments(data: data)
    } catch {
      print("Error when setting cached deployments: \(error)")
    }
    
    // If it's been more than 10 minutes since the last fetch, refresh data
    if (Date().timeIntervalSince(Date(timeIntervalSince1970: cacheTime)) > 600) {
      print("Updating deployments")
      self.loadDeployments()
    }
  }

  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }

  // ============= Main Logic ==============

  func loadDeployments() {
    let delegate = WKExtension.shared().delegate as! ExtensionDelegate

    let headers: HTTPHeaders = [
      "Authorization": "Bearer \(delegate.TOKEN!)", // Force unwrapping here since this shouldn't even be called if there's no token
      "Accept": "application/json"
    ]

    // Using v2 endpoint here because I don't want to deal with SFO/BRU instances and just want the scale.current
    Alamofire.request("https://zeit.co/api/v2/now/deployments", method: .get, headers: headers)
      .responseJSON { response in
        switch response.result {
        case .success(let value):
          // Parse JSON
          let res = JSON(value)
          let delegate = WKExtension.shared().delegate as! ExtensionDelegate
          delegate.storeData(type: .deployments, data: res["deployments"].rawString()!)
          
          self.handleDeployments(data: res["deployments"])
        case .failure(let error):
          print(error)
        }
    }
  }
  
  func handleDeployments(data: JSON) {
    let deployments = data.arrayValue.sorted { $0["name"].stringValue < $1["name"].stringValue }
    
    var lastName = ""; // We'll store last deployment's name here for some UI hacks
    self.deploymentsTable.setNumberOfRows(deployments.count, withRowType: "DeploymentRow")
    
    // Idk, indexes from JSON don't seem to work for some reason
    for index in stride(from: 0, to: deployments.count, by: 1) {
      let deployment = deployments[index]
      let name = deployment["name"].stringValue
      var hasMore: Bool
      var nextName: String
      
      if (index + 1 < deployments.count - 1) {
        hasMore = true
      } else {
        hasMore = false
      }
      
      if (hasMore) {
        nextName = deployments[index + 1]["name"].stringValue
      } else {
        nextName = ""
      }
      
      let row = self.deploymentsTable.rowController(at: index) as! DeploymentRowController
      row.wrapper.setBackgroundColor(UIColor.black)
      
      // Since I'm not allowed to nest tables, let's do this hacky hack
      if (name != lastName) {
        // If we're in a new "group", set the name
        row.groupName.setText(name)
      } else {
        // Since I'm not allowed to delete labels on watchOS either, set height to 0 so it's kinda gone
        row.groupName.setText("")
        row.groupName.setHeight(0)
      }
      
      // If we're in the same group, hide the separator
      if (name == nextName) {
        row.separator.setAlpha(0)
      }

      // Let's strip ".now.sh" and deployment name because limited space
      row.deploymentId.setText(deployment["url"].stringValue.replacingOccurrences(of: ".now.sh", with: "").replacingOccurrences(of: "\(name)-", with: ""))
      
      if (deployment["scale"] == JSON.null) {
        row.instanceIndicator.setHidden(true)
      } else {
        row.instanceCount.setText(String(deployment["scale"]["current"].intValue))
      }
      
      let state = deployment["state"].stringValue
      
      row.state.setText(state)
      if (state == "DEPLOYMENT_ERROR" || state == "BUILD_ERROR") {
        row.state.setAlpha(1)
        row.state.setTextColor(UIColor(red:0.84, green:0.30, blue:0.35, alpha:1.0)) // #D74C58
      }
      let created = Date(timeIntervalSince1970: deployment["created"].doubleValue / 1000)
      row.date.setText(timeAgo(created))
      
      lastName = deployment["name"].stringValue
    }
  }

  // ============= Login Notice ==============

  func showLoginNotice() {
    self.contentGroup.setHidden(true)
    self.loginNotice.setHidden(false)
  }

  func hideLoginNotice() {
    self.loginNotice.setHidden(true)
    self.contentGroup.setHidden(false)
  }

  // ============= Watch Connectivity Session ==============
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    if error != nil {
      print("Watch Connectivity session activation error: \(String(describing: error))")
    }
  }

  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
    // This is how the watch gets the access token from the main app
    if (applicationContext["token"] != nil) {
      // If we have the token in arriving context, set it in delegate, update current UI and fetch deployments
      let token = applicationContext["token"] as! String
      let delegate = WKExtension.shared().delegate as! ExtensionDelegate
      delegate.setToken(token: token)

      self.loadDeployments()
      self.hideLoginNotice()
    } else {
      // If context was emply, token is gone and we need to burn all the evidence
      let delegate = WKExtension.shared().delegate as! ExtensionDelegate
      delegate.clearData()
      self.showLoginNotice()
    }
  }
}
