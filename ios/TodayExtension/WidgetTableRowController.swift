import UIKit

class WidgetTableRowController: UITableViewCell {
	@IBOutlet weak var deploymentURL: UILabel!
	@IBOutlet weak var instanceCount: UILabel!
	@IBOutlet weak var deploymentState: UILabel!
	@IBOutlet weak var deploymentDate: UILabel!
	@IBOutlet weak var instanceImage: UIImageView!
	@IBOutlet weak var instanceImageWidthConstraint: NSLayoutConstraint!
	@IBOutlet weak var instanceCountLeftConstraint: NSLayoutConstraint!
	@IBOutlet weak var deploymentStateLeftConstraint: NSLayoutConstraint!
}
