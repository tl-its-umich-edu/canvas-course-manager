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
1. rename `.env.sample` to `.env` and `config/env_sample.json` to `env.json`
2. `docker-compose build`
3. `docker-compose up`
4. Add tool to any course site in Canvas Test instance(for now), using XML builder https://www.edu-apps.org/build_xml.html
 

#### Task list
1. remove the support for `env.json` and instead use yaml
2. Integrating Material UI to React Frontend
3. Making a API call from Front-end and Backend returning results to test the FE and BE flow
4. Adding support for CSP
5. Storing the course information from LTI launch to some session beyond request/response cycle

### Issues
1. `ERROR: for web  UnixHTTPConnectionPool(host='localhost', port=None): Read timed out.` if this error is accuring then this is possibly due to runnning lot of docker container. Restart the docker or increase Memory usage for docker as suggested here
https://github.com/docker/compose/issues/3927

