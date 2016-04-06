# WalkAbout

Walkabout is a iOS application that will serve as a mobile tour guide as an alternative to private tour guides or large tour groups. WalkAbout automatically plays curated audio content in the form of a brief description and historical context, along with a photo and text transcript when the user approaches a pre-selected location. At the current time there are eight such locations, with the possibility to add many more. 

Team:
Andrew Kim: Designer, QA
Devin Mandelbaum: Git Master, QA
Claire Samuels: Designer
Zander Nelson: Lead, DevOps2, Designer

#General Instructions

![ScreenShot1](./IMG_2705.png) ![ScreenShot2](./IMG_2706.png)

1. At opening, the application brings the user to a fullscreen map centered on their current location.
2. The fullscreen map highlights the pre-selected monuments via a custom marker, and the user's current location with a separate marker.
3. When the user crosses a pre-determined threshold of distance from a monument, it triggers the rendering of a detail page.
4. When the detail page is rendered, the audio content specific to that monument plays automatically. Also on the page is a tab bar for navigation, relevant photograph, an audioplayer interface, and a text transcript of the audio content. 
5. The audioplayer interface allows the user to pause, replay, or resume from the paused point.
6. When the user leaves the monument, and crosses the threshold in the other direction, the application automatically leaves the detail page and returns to the fullscreen map.

#Technical Details

* WalkAbout was written in React Native, primarily in JavaScript ES6.
* We wrote our own geofencing algorithm, utilizing the Pythagorean Theorem to establish our distance threshold for each monument.
* We used React-Native-Sound as our audio player, and MapView Component to display our maps and follow the current location of the user.
* We used the built-in Location Services via Background Geolocation for React Native to acquire the current position of the user. 