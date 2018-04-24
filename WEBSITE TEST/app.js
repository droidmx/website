typer('body')
  .line()
  .line('<span style="color: #2aa198">sreyaash@console</span>:</span><span style="color: #268bd2">~</span> $ </span>', 0)
  .pause(750)

  // cd ~/
  .continue('<span style="color: #d3d3b1">cd ~/site', 100)
  .line()
  .line('<span style="color: #2aa198">sreyaash@console</span>:</span><span style="color: #268bd2">~/site</span> $ </span>', 0)
  .pause(750)

  // ls -al
  .continue('ls -al', 100)
  .line()
  //.line('total 8', 0)
  .line('<span style="color: #d3d3b1">total 6', 0)
  .line('drwxr-xr-x   14 Sreyaash  info      476 Jul 20 16:09 .secretstuff', 0)
  .line('-rw-r--r--    1 Sreyaash  info    61572 Mar  4 02:07 aboutme.txt', 0)
  .line('-rw-r--r--    1 Sreyaash  info      552 Apr 27 13:27 contactme.txt', 0)
  .line('-rw-r--r--    1 Sreyaash  info       37 Aug  6 23:09 futureplans.txt', 0)
  .line('-rw-r--r--    1 Sreyaash  info      327 Aug  8 23:47 profexperience.txt', 0)
  .line('lrw-------    1 Sreyaash  info     7354 Aug  6 23:09 resume -> <a href="resume.docx">/etc/resume.docx</a>', 0)
  .line()
  .line('<span style="color: #2aa198">sreyaash@console</span>:</span><span style="color: #268bd2">~/site</span> $ </span>', 0)
  .pause(1500) // long wait while you look at items in dir

  // cat aboutme.txt
  .continue('<span style="color: #d3d3b1">cat a', 100)
  .continue('<span style="color: #d3d3b1">boutme.txt ', 0) // tab completion
  .line()
  .line('Hi, I&apos;m Sreyaash!', 0)
  .line()
  .line('I&apos;m a Freshman at Northview High School. My interests are International Affairs and Computer Science. My dream college is UC Berkely, and i&apos;m aspiring to be a representative in the UN!', 0)
  .line()
  .line('I enjoy competing at MUN Conferences, and i&apos;ve played piano since I was 3 y/o. I also enjoy video editting, and hope to create a film detailing my highschool experience', 0)
  .line()
  .line('To check out my resume , click the respective link up top!', 0)
  .line('Resume is a docx file.', 0)
  .line()
  .line('<span style="color: #2aa198">sreyaash@console</span>:</span><span style="color: #268bd2">~/site</span> $ </span>', 0)
  .pause(1250)

  // cat profexperience.txt && cat futureplans.txt
  .continue('<span style="color: #d3d3b1">cat p', 100)
  .continue('<span style="color: #d3d3b1">rofexperience.txt ', 0) // tab completion
  .continue('<span style="color: #d3d3b1">&& cat f', 100)
  .continue('<span style="color: #d3d3b1">utureplans.txt ', 0) // tab completion
  .line()
  .line('Kumon Assistant   April 2016 - August 2016', 0)
  .line()
  .line('Summer 2018', 0)
  .line('Attend a MUN camp at Harvard for 2 weeks', 0)
  .line('Improve skills in coding', 0)
  .line('Resume Piano and begin competing', 0)
  .line()
  .line()
  .line('School Year 2018-19', 0)
  .line('Begin competing in Debate', 0)
  .line('Continue MUN', 0)
  .line()
  .line()
  .pause(1250)

  // cat contactme.txt
  .continue('<span style="color: #d3d3b1">cat c', 100)
  .continue('<span style="color: #d3d3b1">ontactme.txt ', 0) // tab completion
  .line()
  .line('If you want to reach out:', 0)
  .line('Email: <a href="mailto:sreyaash.das@gmail.com?Subject=Hello%20again">sreyaash.das@gmail.com</a>', 0)
  .line('Phone: (470)313-5567', 0)
  .line()
  .line(' <a href="https://www.instagram.com/sreyaash/"><img src="github.png" alt="GitHub" height="21" width="21"></a>', 0)
  .continue(' <a href="https://github.com/droidmx"><img src="instagram.png" alt="Instagram" height="23" width="23"></a>', 0)
  .line()
  .line('Thanks for visiting! Hope you enjoyed my little website :)', 0)
  .line()
  .line('<span style="color: #2aa198">sreyaash@console</span>:</span><span style="color: #268bd2">~/site</span> $ </span>', 0)
  .line()
  .line()
  .pause(1250)

  // sudo shutdown -h now
  .continue('<span style="color: #d3d3b1">sudo shutdown -h now', 100)
  .line()

  //.line('</span>', 0)

  .cursor({block: true, blink: 'hard', color: '#fdf6e3'})
;

// use http://manytools.org/image/colorize-filter/ to color icons

// docs: https://www.npmjs.com/package/typer-js
