// #![cfg_attr(
//   all(not(debug_assertions), target_os = "windows"),
//   windows_subsystem = "windows"
// )]

use tauri::{Size, LogicalSize, Manager};

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let main_window = app.get_window("main").unwrap();

      main_window.set_size(Size::Logical(LogicalSize {
        width: 1300.0,
        height: 740.0
      }))
      .unwrap();
      main_window.set_resizable(true).unwrap();
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}