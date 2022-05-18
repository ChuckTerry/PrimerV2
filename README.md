# Blazey Torture  [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FChuckTerry%2FPrimerV2&count_bg=%232E8061&title_bg=%23555555&icon=&icon_color=%239C3A3A&title=Hits&edge_flat=false)](https://hits.seeyoufarm.com) [![Broadcasters -  36 ](https://img.shields.io/badge/Broadcasters-_36_-4e8aaa?logo=https%3A%2F%2Ftheme.zdassets.com%2Ftheme_assets%2F9047795%2F0a1509944ae68221459023756a55d2ada890acfd.png)](https://github.com/ChuckTerry/PrimerV2/edit/main/README.md)
Blazey Torture is a Chaturbate applicated designed and built to accomodate various "Torture" settings for numerous toys, mainly Sybians.

## Features 

* Dynamic Tip Options
  - Tip menus are completely dynamic.  This means they change depending on the state of the app.  Whether the tip menu is periodically shown in chat, or invoked by clicking the Tip menu, you will only be shown options available at the current time (for example, if `Instacum` is ongoing, you will only be shown options to tip for `Cum Denial` and `Mute`/`Unmute`.)
* Custom Splash Screen and Tip Action Banners
  - The splash screen colors are completely custom (configured via Hex color codes) and the Tip Action Banners contain custom text and emojis to help denote actions used.
* Warmup and Lockout Periods for Settings
  - The app can be configured to use both `Warmup` and `Lockout` options.  `Warmup` is used on startup, and will disable either `all actions` or just `Instacum`.  `Lockout` periods are designed to be used with the `Instacum` functionality to prevent spamming.
* Refund Logic
  - Custom built refund logic.  If a user attempts to purchase a tip option that is unavailable (for instance, trying to purchase an `Instacum` when it's already active), that user specifically will be automatically given a special token that they can use later to activate that particular action without wasting Tips.  See the `Commands` section below for usage.

## Installation

Blazey Torture was built on the new app system on Chaturbate, so the app will only function by switching to the new app system.  Once you have switched to the new app system, simply find the app in the list and add to your channel.  Doing so will give you a list of settings to customize, and once you click apply the app will start and move to the "Running Apps" section.  You can change settings at any time, on the fly, by clicking the 3-dots menu on the app and clicking "settings."

## Settings

| Setting      | Description |
| ----------- | ----------- |
| Broadcaster Name     | This will be the name the app uses for the broadcaster.  Leaving this blank will use the room owner name instead.      |
| Tip Options Timer  | How often the dynamic tip options will be displayed in the chat window, in minutes.    |
| Warmup Lockouts  | Either `All Settings` or `Instacum Only`.  Choosing `All Settings` will cause the app to ignore all Toy Control features for the time duration specified in `Warmup Duration.`  Choosing `Instacum Only` will cause `Instacum` to be unavailable until the timer has elapsed.  |
| Warmup Duration  | Duration, in minutes, for the `Warmup timer` to run in the background.  |
| Device Type  | Choose between `Sybian`, `Magic Wand`, or `Other`.  This determines the settings available for those toys.  |
| Tokens to Turn Toy On  | The amount of tokens needed to activate the toy.  |
| Tokens to Turn Toy Off  | The amount of tokens needed to deactivate the toy.  |
| Max Speed  | The max number of speeds your toy supports.  |
| Tokens to Increase Speed   | The amount of tokens needed to increase the speed (vibration intensity) the toy.  |
| Tokens to Decrease Speed   | The amount of tokens needed to decrease the speed (vibration intensity) the toy.  |
| Max Rotation  | The max number of rotation settings your toy supports.  Mainly for Sybians.  |
| Tokens to Increase Rotation   | The amount of tokens needed to increase the rotation speed the toy.  |
| Tokens to Decrease Rotation   | The amount of tokens needed to decrease the rotation speed the toy.  |
| Tokens to Mute   | The amount of tokens needed to cause a mute action (using a ball gag, etc.)  |
| Tokens to Unmute   | The amount of tokens needed to cause an unmute action (removing a ball gag, etc.)  |
| Tokens to Start InstaCum |  The amount of tokens needed to initiate an `Instacum`.  Once `Instacum` is started, only `mute`/`unmute` and `Cum Denial` will be available until the `Instacum` is completed or interrupted.  |
| InstaCum Recovery Time  |  Time, in minutes, that `Instacum` will be unavailable after the previous `Instacum`.  Setting to 0 will disable.  Intended to stop `InstaCum` spamming. |
| Tokens to Start Cum Denial  | The amount of tokens needed to interrupt toy states (mainly used to interrupt `Instacum`.)  Can be overridden by a `Counter Cum Denial` or another `Instacum` |
| Cum Denial Duration  | Duration, in minutes, of how long app control is locked until control is resumed.  Can be overridden by a `Counter Cum Denial` or another `Instacum`.  |
| Tokens to Counter Cum Denial  | Tokens needed to counter a `Cum Denial`.  Countering in this way will revert the app to the previously used state (speed, rotation, `Instacum`, etc.)  |
| Leaderboard Notify Minimum  | The amount of tokens needed to notify chat if a leaderboard increase has occured.  |
| Leaderboard Top Spots  | Number of spots on the leaderboard.  |
| Leaderboard Includes Non-Tips  | Can the leaderboard take into consideration non-tip purchases (fanclub, media, etc.)  |
| App Notice Background Color | Hex Code for the background color or gradient used for the splash screen.  Accepts multiple values, comma separated.  |
| App Notice Text Color | Hex Code for the banner color used for tip notices and menus.  |
| FanClub Free Starts | Number of free starts you would like to give FanClub members.  Setting to 0 disables this feature.  |
| FanClub Free Stops | Number of free stops you would like to give FanClub members.  Setting to 0 disables this feature.  |

## Permissions

This app needs the following permissions:

| Permission  | Needed  |
| ----------- | ----------- |
| Control Video Panel |  `No`  |
| Transform Messages |  `Yes`  |
| Tip Options |  `Yes`  |

## Command Usage

| Command   |  Who Can Use?  |  Action  |
| ----------- | ----------- | ----------- |
| /end  | Broadcaster  | Completes an `Instacum`.  |
| /fanstart  |  Fanclub Members  | Uses a free toy start, if available.  |
| /fanstop  |  Fanclub Members  | Uses a free toy stop, if available.  |
| /use |  All Users  | Used to show the amount of each command token available to you, if you have tried to use an action that was unavailable to you and were issued a token, it will be listed here.  |
| /use `TOKEN_TYPE` |  All Users |  Used to consume a token for the listed action.  Can only be used if the action can be granted.  |
| /grant `USER` `TOKEN_TYPE` | Mods | Used to manually grant a token of a specified type to a user if the app fails to do so.  |
| /stat, /stats, /statistics | Mods |  Used to display current and lifetime stats of the app.  |

## Token Names

| Name |
| ---- |
|`TURNDEVICEOFF`|
|`TURNDEVICEON` |
|`INCREASESPEED` | 
|`DECREASESPEED`| 
|`INCREASEROTATION`| 
|`DECREASEROTATION`| 
|`UNMUTEBROADCASTER`| 
|`MUTEBROADCASTER`|
|`INSTACUM`|
|`CUMDENIAL`| 
|`COUNTERCUMDENIAL`|
