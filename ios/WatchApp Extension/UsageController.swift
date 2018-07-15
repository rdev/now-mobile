//
//  InterfaceController.swift
//  WatchApp Extension
//
//  Created by Max Rovensky on 16/07/2018.
//  Copyright © 2018. All rights reserved.
//

import WatchKit
import Foundation

class UsageController: WKInterfaceController {

  // @TODO UserSettings
  let TOKEN = "";
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
  
    // Configure interface objects here.
    self.setTitle("Now")
  }
    
  override func willActivate() {
    // This method is called when watch view controller is about to be visible to user
    super.willActivate()
    self.getUsage()
  }
    
  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }
  
  func getUsage() {
    // Get usage 
  }
}
