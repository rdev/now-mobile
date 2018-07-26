import WatchKit
import Alamofire
import SwiftyJSON

enum StoredDataType {
  case usage
  case aliases
  case deployments
}

class ExtensionDelegate: NSObject, WKExtensionDelegate {
  var complicationData = NSMutableDictionary()
  var TOKEN: String?

  func applicationDidFinishLaunching() {
    // This is like the highest componentDidMount, so we need to do high level stuff here

    // Set up background data load
    self.scheduleBackground()

    // Set token
    guard let token = UserDefaults.standard.string(forKey: "token") else { return }
    self.TOKEN = token
  }

  func applicationDidBecomeActive() {
    // Set complication data
    guard let cachedUsage = UserDefaults.standard.string(forKey: "lastUsage") else { return }

    do {
      let dataFromString = cachedUsage.data(using: .utf8, allowLossyConversion: false)
      let data = try JSON(data: dataFromString!)
     
      // Save complication data
      let usage = JSON(data)
      let limits = Plans[usage["mode"].stringValue]!
      
      let bandwidthUsage = Units(bytes: usage["metrics"]["bandwidth"]["tx"].int64!).pretty()
      self.complicationData["bandwidth"] = bandwidthUsage
      self.complicationData["bandwidthLimit"] =  limits["bandwidth"]
      self.complicationData["instances"] = String(usage["activeInstances"].intValue)
    } catch {
      print("Error when setting cached usage: \(error)")
    }
  }

  func applicationWillResignActive() {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, etc.
  }

  func handle(_ backgroundTasks: Set<WKRefreshBackgroundTask>) {
    for task in backgroundTasks {
      // Use a switch statement to check the task type
      switch task {
        case let backgroundTask as WKApplicationRefreshBackgroundTask:
          print("Background task starting...")
          let headers: HTTPHeaders = [
            "Authorization": "Bearer TPFCaLFfDdlU6pUvRhKwZ0jY",
            "Accept": "application/json"
          ]
          
          // @TODO I don't know Swift but even I think this is horrible and needs to be refactored
          // Fetch deployments
          Alamofire.request("https://zeit.co/api/v2/now/deployments", method: .get, headers: headers)
            .responseJSON { response in
              switch response.result {
              case .success(let value):
                let deployments = JSON(value)
                self.storeData(type: .deployments, data: deployments["deployments"].rawString()!)

                // Then fetch aliases
                Alamofire.request("https://zeit.co/api/v2/now/aliases", method: .get, headers: headers)
                  .responseJSON { response in
                    switch response.result {
                    case .success(let value):
                      let aliases = JSON(value)
                      self.storeData(type: .aliases, data: aliases["aliases"].rawString()!)

                      // Then fetch usage
                      Alamofire.request("https://zeit.co/api/pricing/state/usage", method: .get, headers: headers)
                        .responseJSON { response in
                          switch response.result {
                          case .success(let value):
                            let usage = JSON(value)
                            self.storeData(type: .usage, data: usage["usage"].rawString()!)

                            // And we're done
                            print("Background task done")

                            self.scheduleBackground() // Schedule the next one

                            backgroundTask.setTaskCompletedWithSnapshot(false)
                          case .failure(let error):
                            print(error)
                            backgroundTask.setTaskCompletedWithSnapshot(false)
                          }
                      }
                    case .failure(let error):
                      print(error)
                      backgroundTask.setTaskCompletedWithSnapshot(false)
                    }
                }
              case .failure(let error):
                print(error)
                backgroundTask.setTaskCompletedWithSnapshot(false)
              }
          }
        case let snapshotTask as WKSnapshotRefreshBackgroundTask:
          // Snapshot tasks have a unique completion call, make sure to set your expiration date
          snapshotTask.setTaskCompleted(restoredDefaultState: true, estimatedSnapshotExpiration: Date.distantFuture, userInfo: nil)
        case let connectivityTask as WKWatchConnectivityRefreshBackgroundTask:
          // Be sure to complete the connectivity task once you’re done.
          connectivityTask.setTaskCompletedWithSnapshot(false)
        case let urlSessionTask as WKURLSessionRefreshBackgroundTask:
          // Be sure to complete the URL session task once you’re done.
          urlSessionTask.setTaskCompletedWithSnapshot(false)
        default:
          // make sure to complete unhandled task types
          task.setTaskCompletedWithSnapshot(false)
      }
    }
  }
  
  func scheduleBackground() {
    // Schedule data refresh 15 minutes from now
    WKExtension.shared().scheduleBackgroundRefresh(withPreferredDate: Date(timeIntervalSinceNow: 15 * 60), userInfo: nil) { (error: Error?) in
      if let error = error {
        print("Error occurred while scheduling background refresh: \(error.localizedDescription)")
      }
    }
  }
  
  func storeData(type: StoredDataType, data: String) {
    // This method writes necessary data to UserDefaults and the delegate
    switch type {
    case .usage:
      UserDefaults.standard.set(data, forKey: "lastUsage")
      UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "usageTimestamp")
      
      // Save complication data
      do {
        let dataFromString = data.data(using: .utf8, allowLossyConversion: false)
        let usage = try JSON(data: dataFromString!)
        let limits = Plans[usage["mode"].stringValue]!
        
        let bandwidthUsage = Units(bytes: usage["metrics"]["bandwidth"]["tx"].int64!).pretty()
        self.complicationData["bandwidth"] = bandwidthUsage
        self.complicationData["bandwidthLimit"] =  limits["bandwidth"]
        self.complicationData["instances"] = String(usage["metrics"]["activeInstances"].intValue)
      } catch {
          print("Error saving complication data: \(error)")
      }
    case .aliases:
      UserDefaults.standard.set(data, forKey: "lastAliases")
      UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "aliasesTimestamp")
    case .deployments:
      UserDefaults.standard.set(data, forKey: "lastDeployments")
      UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "deploymentsTimestamp")
    }
  }

  func clearData() {
    // This method burns everything. Used on logout from the main app
    UserDefaults.standard.removeObject(forKey: "lastAliases")
    UserDefaults.standard.removeObject(forKey: "aliasesTimestamp")
    UserDefaults.standard.removeObject(forKey: "lastDeployments")
    UserDefaults.standard.removeObject(forKey: "deploymentsTimestamp")
    UserDefaults.standard.removeObject(forKey: "lastUsage")
    UserDefaults.standard.removeObject(forKey: "usageTimestamp")
    UserDefaults.standard.removeObject(forKey: "token")
    self.complicationData = NSMutableDictionary()
    self.TOKEN = nil
  }

  func setToken(token: String) {
    // Set token in delegate and save in UserDefaults
    self.TOKEN = token
    UserDefaults.standard.set(token, forKey: "token")
  }
}
