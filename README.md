#World of Warriors Simulator</br>
An open source project based on the now deceased mobile game by Mind Candy.<br />
<br />
#Download instructions</br>
Click the download button<br />
then unzip<br />
#How to run</br>
Since the program uses Javascript modules and fetch, it cannot be run by simply dragging the files into the browser.<br />
You can either launch the program through Netbeans,</br>
or launch it using Python, like so: </br>
<ol>
<li>Navigate to the same directory as index.html using your terminal.</li>
<li>use <code>python -m http.server [PORT]</code> or <code>python3 -m http.server [PORT]</code> if you have python 3 installed,
but if you have python 2 installed, use <code>python -m SimpleHTTPServer [PORT]</code> or <code>python2 -m SimpleHTTPServer [PORT]</code> </li>
<li>Once the server has started successfully, open your favorite web browser, and go to http://localhost:[PORT]/index.html</li>
<li>Once you are done playing, type <code>control-c</code> into the terminal to shut down the server</li>
</ol>

<h2>Features</h2>
<ul>
<li>Allows user to design teams using a selection of warriors from the original game</li>
<li>Player vs player battles (both players use the same computer)</li>
<li>Most battle features from the original game exist, except for strategic heart collection and skill games</li>
</ul
<h2>Planned features</h2>
<ul>
<li>Player vs player over the internet</li>
<li>All special moves, warriors, talismans, and warrior skills from the original game</li>
<li>Ability to create custom warriors</li>
</ul>
<h2>Not going to implement</h2>
<ul>
<li>Skill games and strategic heart collection. Strategy is too niche.</li>
</ul>

note: only tested in Chrome<br />
