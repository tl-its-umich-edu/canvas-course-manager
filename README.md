## Canvas Course Manger(CCM)

This is a Canvas Peripheral tool that have features doesn't supported by Canvas LMS. Mostly adds additional feature that 
instructors and subaccounts of canvas can do it them self via CCM. Features include
1. Creating section, groups adding user to those
2. Adding non-institution user to a course site
3. Cross listing sections in a course

This is a rewrite of the tool  https://github.com/tl-its-umich-edu/canvas_course_manager

Bare minimum Docker support combining Fronted(React), Backend(Django) and LTI 1.0


This Project is still work in progress.

### Build and Running instructions
1. rename `.env.sample` to `.env` 
   1. fill in a random strig for DJANGO_SECRET_KEY
   2. provide CANVAS_INSTANCE url, e.g. `CANVAS_INSTANCE=https://psu.test.instructure.com`
2. `docker-compose build`
3. `docker-compose up`
## LTI tool configuration
 Install NGrok. This is needed so Canvas can get an https to your localhost
1. On OSX you can install with homebrew `brew cask install ngrok` or with their package.
2. It looks like `npm install -g ngrok` might also work
3. Start ngrok with `ngrok http 8001`
   1. This forwards http to 8001, it will have a bunch of logging information.
   2. It also opens a neat request inspection interface to aid with debugging at http://localhost:4040 
4. Now try to test it!
   1. Go to the XML Config Builder.
   2. Fill in the name, id, description to whatever you want.
   3. The launch URL would look like https://8j94a1326.ngrok.io/lti/auth/
   4. Launch Privacy needs to be Public
   5. Then extensions should probably be Course navigation, leaving the rest as is
   6. Generate the XML, copy and paste the output (Firefox might have an issue copying) and use that to add a new LTI tool 
      to a course or globally.
5. Configuring the LTI tool in a course in canvas
   1. Go to course setting and App
   2. click on add App and select `paste.xml` and paste the XML generated from step 4
   3. Name the tool as you want and give consumer key as `key` and consumer secret as `secret`. Save and reload canvas
      to see the tool. and Click the tool to launch
6. Setup LTI launch paarameter to make variables availalbe
   1. Canvas -> Course -> Settings -> Apps -> View App Configurations -> your app -> Edit -> add "Canvas.course.sisSourceId" to Custom Fields

## Intalling CCM setup for windows user especially docker
1. Disable Hyper-V on Windows.
2. Install VirtualBox.
3. Download Ubuntu.
    a. Use Ubuntu 18.04.3 LTS. Ubuntu 12.04 LTS does not work properly with Docker.
4. Create and Run a Linux Virtual Machine (VM) using VirtualBox.
5. Log in on your Linux VM.
6. Install Docker. sudo apt install docker.io
7. Start and enable Docker. sudo systemctl start docker && sudo systemctl enable docker
8. Install docker-compose.
    a. Remove previous installation (if needed). sudo apt-get remove docker-compose
    b. sudo curl -L "https://github.com/docker/compose/releases/download/1.25.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    c. sudo chmod +x /usr/local/bin/docker-compose
    d. sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
9. Install Git.

## Sample csv file for sis process
1. For bulk creation of section and adding user sample files are in sample_csv folder

### Issues
1. `ERROR: for web  UnixHTTPConnectionPool(host='localhost', port=None): Read timed out.` if this error is occurring then 
this is possibly due to running lot of docker container. Restart the docker or increase Memory usage for docker as 
suggested here https://github.com/docker/compose/issues/3927

