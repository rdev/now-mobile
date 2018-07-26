import WatchKit
import Foundation
import Alamofire
import SwiftyJSON

class UsageController: WKInterfaceController {
  @IBOutlet var domains: WKInterfaceLabel!
  @IBOutlet var instances: WKInterfaceLabel!
  @IBOutlet var instancesLimit: WKInterfaceLabel!
  @IBOutlet var bandwidth: WKInterfaceLabel!
  @IBOutlet var bandwidthLimit: WKInterfaceLabel!
  @IBOutlet var logs: WKInterfaceLabel!
  @IBOutlet var logsLimit: WKInterfaceLabel!
  @IBOutlet var billingPeriod: WKInterfaceLabel!
  @IBOutlet var contentGroup: WKInterfaceGroup!
  @IBOutlet var loginNotice: WKInterfaceGroup!
  @IBAction func refresh() {
    self.getUsage()
  }
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
  
    // Configure interface objects here.
    self.setTitle("Now")
  }
    
  override func willActivate() {
    // Same deal as in other controllers: show login notice if there's no token, try to set data from cache if any and update if necessary
    super.willActivate()

    let delegate = WKExtension.shared().delegate as! ExtensionDelegate

    if delegate.TOKEN == nil {
      self.showLoginNotice()
      return
    } else {
      self.hideLoginNotice()
    }

    guard let cachedUsage = UserDefaults.standard.string(forKey: "lastUsage") else {
      self.getUsage()
      return
    }
    let cacheTime = UserDefaults.standard.double(forKey: "usageTimestamp")
    
    do {
      let dataFromString = cachedUsage.data(using: .utf8, allowLossyConversion: false)
      let data = try JSON(data: dataFromString!)
      print("Loading usage from cache")
      self.handleUsage(data: data)
    } catch {
      print("Error when setting cached usage: \(error)")
    }
    
    // If it's been more than 10 minutes since the last fetch, refresh data
    if (Date().timeIntervalSince(Date(timeIntervalSince1970: cacheTime)) > 600) {
      print("Updating usage")
      self.getUsage()
    }
    self.getUsage()
  }
    
  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }
  
  func getUsage() {
    let delegate = WKExtension.shared().delegate as! ExtensionDelegate
    let headers: HTTPHeaders = [
      "Authorization": "Bearer \(delegate.TOKEN!)",
      "Accept": "application/json"
    ]

    Alamofire.request("https://zeit.co/api/pricing/state/usage", method: .get, headers: headers)
      .responseJSON { response in
        switch response.result {
          case .success(let value):
            // Parse JSON
            let res = JSON(value)
            let delegate = WKExtension.shared().delegate as! ExtensionDelegate
            delegate.storeData(type: .usage, data: res.rawString()!)
            
            self.handleUsage(data: res)
          case .failure(let error):
            print(error)
      }
    }
  }
  
  func handleUsage(data: JSON) {
    let limits = Plans[data["mode"].stringValue]
    
    // Set all the labels
    
    self.domains.setText(String(describing: data["metrics"]["domains"].int!))
    
    self.instances.setText(String(describing: data["metrics"]["activeInstances"].int!))
    self.instancesLimit.setText(limits?["concurrentInstances"])

    self.bandwidth.setText(String(describing: Units(bytes: data["metrics"]["bandwidth"]["tx"].int64!).pretty()))
    self.bandwidthLimit.setText(limits?["bandwidth"])
    
    self.logs.setText(String(describing: Units(bytes: data["metrics"]["logs"]["size"].int64!).pretty()))
    self.logsLimit.setText(limits?["logs"])
    
    // Parse ISO string and set billing period
    let parseDateFormatter = DateFormatter()
    parseDateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"
    
    let date = parseDateFormatter.date(from: data["metrics"]["startTime"].stringValue)
    
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "dd MMMM"
    
    self.billingPeriod.setText("\(dateFormatter.string(from: date!).uppercased()) - \(dateFormatter.string(from: Date()).uppercased())")
  }

  func showLoginNotice() {
    self.contentGroup.setHidden(true)
    self.loginNotice.setHidden(false)
  }

  func hideLoginNotice() {
    self.loginNotice.setHidden(true)
    self.contentGroup.setHidden(false)
  }
}
