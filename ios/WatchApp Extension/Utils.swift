import Foundation

// This is the bytes formatter that will display pretty values like "24MB"
public struct Units {
  public let bytes: Int64
  
  public var kilobytes: Double {
    return Double(bytes) / 1_024
  }
  
  public var megabytes: Double {
    return kilobytes / 1_024
  }
  
  public var gigabytes: Double {
    return megabytes / 1_024
  }
  
  public init(bytes: Int64) {
    self.bytes = bytes
  }
  
  public func pretty() -> String {
    switch bytes {
    case 0..<1_024:
      return "\(bytes) bytes"
    case 1_024..<(1_024 * 1_024):
      return "\(String(format: "%.1f", kilobytes))KB"
    case 1_024..<(1_024 * 1_024 * 1_024):
      return "\(String(format: "%.1f", megabytes))MB"
    case (1_024 * 1_024 * 1_024)...Int64.max:
      return "\(String(format: "%.1f", gigabytes))GB"
    default:
      return "\(bytes)B"
    }
  }
}

// Now plans and their respective limits
public let Plans = [
  "oss": [
    "bandwidth": "1GB",
    "logs": "100MB",
    "concurrentInstances": "3"
  ],
  "free": [
    "bandwidth": "1GB",
    "logs": "100MB",
    "concurrentInstances": "3"
  ],
  "premium": [
    "bandwidth": "50GB",
    "logs": "1GB",
    "concurrentInstances": "10"
  ],
  "pro": [
    "bandwidth": "200GB",
    "logs": "3GB",
    "concurrentInstances": "25"
  ],
  "advanced": [
    "bandwidth": "500GB",
    "logs": "10GB",
    "concurrentInstances": "50"
  ],
  "on-demand": [
    "bandwidth": "∞",
    "logs": "∞",
    "concurrentInstances": "∞"
  ],
  "unlimited": [
    "bandwidth": "∞",
    "logs": "∞",
    "concurrentInstances": "∞"
  ],
]

// This is a neat Moment.js replacement to format dates
public func timeAgo(_ date: Date) -> String {
  let calendar = NSCalendar.current
  let unitFlags: Set<Calendar.Component> = [.minute, .hour, .day, .second]
  let now = Date()
  let earliest = now < date ? now : date
  let latest = (earliest == now) ? date : now
  let components = calendar.dateComponents(unitFlags, from: earliest,  to: latest)
  
  if (components.day! >= 2) {
    return "\(components.day!)d"
  } else if (components.day! >= 1){
    return "1d"
  } else if (components.hour! >= 1) {
    return "\(components.hour!)h"
  } else if (components.minute! >= 1) {
    return "\(components.minute!)m"
  } else if (components.second! >= 1) {
    return "\(components.second!)s"
  } else {
    return "1s"
  }
}
