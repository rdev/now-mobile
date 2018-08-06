import UIKit
import NotificationCenter

// This is used for deserializing JSON
struct UsageWidgetJSON: Decodable {
  let data: UsageWidgetData
}

struct UsageWidgetData: Codable {
  let instances: Int?
  let instancesLimit: String?
  let bandwidth: String?
  let bandwidthLimit: String?

  private enum CodingKeys: String, CodingKey {
    case instances
    case instancesLimit
    case bandwidth
    case bandwidthLimit
  }
}

class TodayViewController: UIViewController, NCWidgetProviding {
  @IBOutlet weak var instances: UILabel!
  @IBOutlet weak var instancesLimit: UILabel!
  @IBOutlet weak var bandwidth: UILabel!
  @IBOutlet weak var bandwidthLimit: UILabel!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view from its nib.
  }

  func widgetPerformUpdate(completionHandler: (@escaping (NCUpdateResult) -> Void)) {
    self.refreshData()
    completionHandler(NCUpdateResult.newData)
  }

  func refreshData() {
    let sharedContainer = UserDefaults(suiteName: "group.im.rdev.now-mobile")
    let usageJSON = sharedContainer?.string(forKey: "usage")

    do {
      let decoder = JSONDecoder()
      let usage = try decoder.decode(UsageWidgetJSON.self, from: (usageJSON?.data(using: .utf8))!)

      self.instances.text = String(usage.data.instances!)
      self.instancesLimit.text = String(usage.data.instancesLimit!)
      self.bandwidth.text = usage.data.bandwidth!
      self.bandwidthLimit.text = usage.data.bandwidthLimit!
    } catch let err {
      print("Error decoding JSON", err)
    }
  }
}
