import WatchKit
import Foundation
import Alamofire
import SwiftyJSON

class AliasesController: WKInterfaceController {
  @IBOutlet var aliasesTable: WKInterfaceTable!
  @IBOutlet var contentGroup: WKInterfaceGroup!
  @IBOutlet var loginNotice: WKInterfaceGroup!
  @IBAction func refresh() {
    self.loadAliases()
  }

  override func awake(withContext context: Any?) {
    super.awake(withContext: context)

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

    guard let cachedAliases = UserDefaults.standard.string(forKey: "lastAliases") else {
      self.loadAliases()
      return
    }
    let cacheTime = UserDefaults.standard.double(forKey: "aliasesTimestamp")

    do {
      let dataFromString = cachedAliases.data(using: .utf8, allowLossyConversion: false)
      let data = try JSON(data: dataFromString!)
      print("Loading aliases from cache")
      self.handleAliases(data: data)
    } catch {
      print("Error when setting cached aliases: \(error)")
    }
    
    // If it's been more than 10 minutes since the last fetch, refresh data
    if (Date().timeIntervalSince(Date(timeIntervalSince1970: cacheTime)) > 600) {
      print("Updating aliases")
      self.loadAliases()
    }
  }
  
  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }
  
  func loadAliases() {
    let delegate = WKExtension.shared().delegate as! ExtensionDelegate
    let headers: HTTPHeaders = [
      "Authorization": "Bearer \(delegate.TOKEN!)",
      "Accept": "application/json"
    ]
    
    Alamofire.request("https://zeit.co/api/v2/now/aliases", method: .get, headers: headers)
      .responseJSON { response in
        switch response.result {
        case .success(let value):
          // Parse JSON
          let res = JSON(value)
          let delegate = WKExtension.shared().delegate as! ExtensionDelegate
          delegate.storeData(type: .aliases, data: res["aliases"].rawString()!)
          
          self.handleAliases(data: res["aliases"])
        case .failure(let error):
          print(error)
        }
    }
  }
  
  func handleAliases(data: JSON) {
    let aliasCount = data.arrayValue.count
    // Set table row count
    self.aliasesTable.setNumberOfRows(aliasCount, withRowType: "AliasRow")
    
    // Idk, indexes from JSON don't seem to work for some reason
    for index in stride(from: 0, to: aliasCount, by: 1) {
      let alias = data[index]
      let row = self.aliasesTable.rowController(at: index) as! AliasRowController
      row.wrapper.setBackgroundColor(UIColor.black)
      
      row.domain.setText(alias["alias"].stringValue)
      row.deploymentUrl.setText(alias["deployment"]["url"].stringValue)
    }
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
