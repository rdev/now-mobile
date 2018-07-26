import ClockKit
import WatchKit

class ComplicationController: NSObject, CLKComplicationDataSource {
    
  // MARK: - Timeline Configuration
  
  func getSupportedTimeTravelDirections(for complication: CLKComplication, withHandler handler: @escaping (CLKComplicationTimeTravelDirections) -> Void) {
    handler([.forward, .backward])
  }
  
  func getTimelineStartDate(for complication: CLKComplication, withHandler handler: @escaping (Date?) -> Void) {
    handler(nil)
  }
  
  func getTimelineEndDate(for complication: CLKComplication, withHandler handler: @escaping (Date?) -> Void) {
    handler(nil)
  }
  
  func getPrivacyBehavior(for complication: CLKComplication, withHandler handler: @escaping (CLKComplicationPrivacyBehavior) -> Void) {
    handler(.showOnLockScreen)
  }
  
  // MARK: - Timeline Population
  
  func getCurrentTimelineEntry(for complication: CLKComplication, withHandler handler: @escaping (CLKComplicationTimelineEntry?) -> Void) {
    // Get the latest saved data from the delegate
    let delegate = WKExtension.shared().delegate as! ExtensionDelegate
    let bandwidth = delegate.complicationData["bandwidth"] ?? "-"
    let bandwidthLimit = delegate.complicationData["bandwidthLimit"] ?? "-"
    let instances = delegate.complicationData["instances"] ?? "-"

    // Set templates and return entry for each complication type
    switch complication.family {
    case .modularLarge:
      let template = CLKComplicationTemplateModularLargeStandardBody()
      template.headerImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Modular")!)
      template.headerTextProvider = CLKSimpleTextProvider(text: "Now")
      template.body1TextProvider = CLKSimpleTextProvider(text: "Instances: \(String(describing: instances))", shortText: "I: \(String(describing: instances))")
      template.body2TextProvider = CLKSimpleTextProvider(text: "Bandwidth: \(String(describing: bandwidth))/\(String(describing: bandwidthLimit))", shortText: "BW: \(String(describing: bandwidth))/\(String(describing: bandwidthLimit))")
      
      let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)
      
      handler(entry)
    case .modularSmall:
      let template = CLKComplicationTemplateModularSmallStackImage()
      template.line1ImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Modular")!)
      template.line2TextProvider = CLKSimpleTextProvider(text: instances as! String)

      let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)

      handler(entry)
    case .circularSmall:
      let template = CLKComplicationTemplateCircularSmallStackImage()
      template.line1ImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Circular")!)
      template.line2TextProvider = CLKSimpleTextProvider(text: instances as! String)

      let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)

      handler(entry)
    case .utilitarianSmall:
      let template = CLKComplicationTemplateUtilitarianSmallFlat()
      template.imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Utilitarian")!)
      template.textProvider = CLKSimpleTextProvider(text: instances as! String)

      let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)

      handler(entry)
    case .utilitarianSmallFlat:
      let template = CLKComplicationTemplateUtilitarianSmallFlat()
      template.imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Utilitarian")!)
      template.textProvider = CLKSimpleTextProvider(text: instances as! String)

      let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)

      handler(entry)
    case .utilitarianLarge:
      let template = CLKComplicationTemplateUtilitarianLargeFlat()
      template.imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Utilitarian")!)
      template.textProvider = CLKSimpleTextProvider(text: "Instances: \(String(describing: instances))")

      let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)

      handler(entry)
    case .extraLarge:
      let template = CLKComplicationTemplateExtraLargeStackImage()
      template.line1ImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Extra Large")!)
      template.line2TextProvider = CLKSimpleTextProvider(text: instances as! String)

      let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)

      handler(entry)
    default:
      handler(nil)
    }
  }
  
  func getTimelineEntries(for complication: CLKComplication, before date: Date, limit: Int, withHandler handler: @escaping ([CLKComplicationTimelineEntry]?) -> Void) {
    // Call the handler with the timeline entries prior to the given date
    handler(nil)
  }
  
  func getTimelineEntries(for complication: CLKComplication, after date: Date, limit: Int, withHandler handler: @escaping ([CLKComplicationTimelineEntry]?) -> Void) {
    // Call the handler with the timeline entries after to the given date
    handler(nil)
  }
  
  // MARK: - Placeholder Templates

  func getLocalizableSampleTemplate(for complication: CLKComplication, withHandler handler: @escaping (CLKComplicationTemplate?) -> Void) {
    // Create placeholder template for each complication type
    switch complication.family {
    case .modularLarge:
      let template = CLKComplicationTemplateModularLargeStandardBody()
      template.headerImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Modular")!)
      template.headerTextProvider = CLKSimpleTextProvider(text: "Now")
      template.body1TextProvider = CLKSimpleTextProvider(text: "Instances: -", shortText: "Inst: -")
      template.body2TextProvider = CLKSimpleTextProvider(text: "Bandwidth: -", shortText: "B/W: -")
     
      handler(template)
    case .modularSmall:
      let template = CLKComplicationTemplateModularSmallStackImage()
      template.line1ImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Modular")!)
      template.line2TextProvider = CLKSimpleTextProvider(text: "-")
     
      handler(template)
    case .circularSmall:
      let template = CLKComplicationTemplateCircularSmallStackImage()
      template.line1ImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Circular")!)
      template.line2TextProvider = CLKSimpleTextProvider(text: "-")

      handler(template)
    case .utilitarianSmall:
      let template = CLKComplicationTemplateUtilitarianSmallFlat()
      template.imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Utilitarian")!)
      template.textProvider = CLKSimpleTextProvider(text: "-")

      handler(template)
    case .utilitarianSmallFlat:
      let template = CLKComplicationTemplateUtilitarianSmallFlat()
      template.imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Utilitarian")!)
      template.textProvider = CLKSimpleTextProvider(text: "-")

      handler(template)
    case .utilitarianLarge:
      let template = CLKComplicationTemplateUtilitarianLargeFlat()
      template.imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Utilitarian")!)
      template.textProvider = CLKSimpleTextProvider(text: "Instances: -")

      handler(template)
    case .extraLarge:
      let template = CLKComplicationTemplateExtraLargeStackImage()
      template.line1ImageProvider = CLKImageProvider(onePieceImage: UIImage(named: "Complication/Extra Large")!)
      template.line2TextProvider = CLKSimpleTextProvider(text: "-")

      handler(template)
    default:
      handler(nil)
    }
  }
}
