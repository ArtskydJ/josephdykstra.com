---
title: Compiling NXC using Sublime's Build system
date: 2019-03-16
---

- NXT is a Lego Mindstorms robot
- NXT-G is the default programming software for the NXT, using visual Drag-and-Drop "blocks"
- NXC is a C-like programming language for the NXT
- NBC is a compiler for NXC code, as well as a couple other languages
- BricxCC is an IDE for the languages that NBC supports
- FLL is a competition using NXT robots, which only allows NXT-G

I used NXT-G to program [FLL](https://www.josephdykstra.com/fll) robots, many years ago. For personal fun projects, I was disappointed in the limitations of NXT-G. It doesn't even have arrays. So I used the [BricxCC](http://bricxcc.sourceforge.net/) IDE, and I wrote code in the [NXC](http://bricxcc.sourceforge.net/nbc/) programming language. I was able to create much more interesting and advanced programs for the NXT using NXC than I had been able to create using NXT-G. I created clones of some classic games like [Simon](https://github.com/ArtskydJ/nxc-simon), [Snake](https://github.com/ArtskydJ/nxc-snake), and [Tetris](https://github.com/ArtskydJ/nxc-tetris). I developed those games using BricxCC. The cursor behavior in BricxCC is quite different from most text editors, and I got used to it, and liked it.

A month ago, I programmed the NXT robot, and I really disliked the BricxCC IDE, and it's funky cursor behavior. I wanted to develop NXC programs using Sublime Text, and to download the programs using Sublime Text's Build System.

So I made a Sublime Text 3 build script for compiling the current file, and downloading it via USB. To use the same script I have, follow the steps below:

(Note that I did this on Windows. I don't know if you can make it work using macOS or Linux. Let me know if you make it work!)

1. Open Sublime Text, and click *Tools* > *Build System* > *New Build System...*

2. Delete the placeholder JSON, and paste the following JSON:

```json
{
	"cmd": [
		// Replace next line with your nbc.exe path!
		"C:\\Program Files (x86)\\BricxCC\\nbc.exe",
		"-S=usb",
		"-d", // -d: Download, -r: Download and Run
		"-sm-", // Avoid nbc status messages
		"$file"
	],
	"file_patterns": [ "*.nxc" ],
	"file_regex": "^File \"(.+)\" ; line (\\d+)",
	"quiet": true // Avoid sublime environment info
}
```

3. Replace line 4 with your actual `nbc.exe` path. If you've already got BricxCC installed on a 64-bit Windows machine, my path above should work for you.

4. Save the file as `NXC.sublime-build`.

5. Connect your NXT, open an `.nxc` file, and hit <kbd>Ctrl</kbd><kbd>B</kbd>!
