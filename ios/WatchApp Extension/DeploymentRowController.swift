import WatchKit
import Foundation
import Alamofire
import SwiftyJSON

class DeploymentRowController: NSObject {
  @IBOutlet var groupName: WKInterfaceLabel!
  @IBOutlet var deploymentId: WKInterfaceLabel!
  @IBOutlet var instanceIndicator: WKInterfaceGroup!
  @IBOutlet var instanceCount: WKInterfaceLabel!
  @IBOutlet var state: WKInterfaceLabel!
  @IBOutlet var date: WKInterfaceLabel!
  @IBOutlet var wrapper: WKInterfaceGroup!
  @IBOutlet var separator: WKInterfaceSeparator!
}
