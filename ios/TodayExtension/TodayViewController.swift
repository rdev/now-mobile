//
//  TodayViewController.swift
//  TodayExtension
//
//  Created by Max Rovensky on 05/07/2018.
//  Copyright © 2018. All rights reserved.
//

// @TODO Handle unauthenticated case (cur: "Unable to load")

import UIKit
import NotificationCenter

// This is used for deserializing JSON
struct DeploymentsWidgetJSON: Decodable {
  let data: [DeploymentWidgetItem]
}

struct DeploymentWidgetItem: Codable {
  let instances: Int?
  let state: String?
  let url: String?
  let date: String?

  private enum CodingKeys: String, CodingKey {
    case instances
    case state
    case url
    case date
  }
}

class TodayViewController: UIViewController, NCWidgetProviding {
  @IBOutlet weak var tableView: UITableView!
  @IBOutlet weak var tableViewHeightConstraint: NSLayoutConstraint!

  var data = [DeploymentWidgetItem]()

	override func viewDidLoad() {
    super.viewDidLoad()

    // Set support for expanded mode
    extensionContext?.widgetLargestAvailableDisplayMode = .expanded

    self.refreshData() // Get data from the shared group
  }

  func widgetPerformUpdate(completionHandler: (@escaping (NCUpdateResult) -> Void)) {
    self.refreshData() // Get fresh data
    completionHandler(NCUpdateResult.newData) // Signal completion
  }

  @available(iOSApplicationExtension 10.0, *)
  func widgetActiveDisplayModeDidChange(_ activeDisplayMode: NCWidgetDisplayMode, withMaximumSize maxSize: CGSize) {
    if activeDisplayMode == .expanded {
      preferredContentSize = CGSize(width: maxSize.width, height: 260) // Set the container size for expanded mode
      tableViewHeightConstraint.constant = 250 // Set the table height accordingly
    }
    else if activeDisplayMode == .compact {
      preferredContentSize = maxSize
       tableViewHeightConstraint.constant = 98 // 2 pixels less to hide the divider
    }
  }

  func refreshData() {
    let sharedContainer = UserDefaults(suiteName: "group.im.rdev.now-mobile")
    let deploymentsJSON = sharedContainer?.string(forKey: "deployments")

    do {
      let decoder = JSONDecoder()
      let deployments = try decoder.decode(DeploymentsWidgetJSON.self, from: (deploymentsJSON?.data(using: .utf8))!)

      // Write data and refresh table
      data = deployments.data;
      tableView.reloadData()
    } catch let err {
      print("Error decoding JSON", err)
    }
  }
}

extension TodayViewController: UITableViewDelegate, UITableViewDataSource {
  // Determine numer of rows. This is always gonna be 5 max because that's what we're saving from JS
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return data.count;
  }

  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "WidgetTableRowController", for: indexPath) as! WidgetTableRowController

    let item = data[indexPath.row]

    cell.deploymentURL?.text = item.url
    cell.instanceCount?.text = item.instances! > -1 ? "\(item.instances!)  |" : ""
    cell.deploymentState?.text = item.state
    cell.deploymentDate?.text = "|  \(item.date!)"

    // @TODO maybe use single NSMutableAttributedString here?
    if (item.state == "DEPLOYMENT_ERROR" || item.state == "BUILD_ERROR") {
      cell.deploymentState.textColor = UIColor(red:0.92, green:0.27, blue:0.27, alpha:1.0) // #EA4545
    }

    if item.instances == -1 {
      cell.instanceImage.image = nil
      cell.instanceCount.isHidden = true
      cell.instanceImageWidthConstraint.constant = 0
      cell.instanceCountLeftConstraint.constant = 0
      cell.deploymentStateLeftConstraint.constant = 0
    }

    return cell
  }
}
