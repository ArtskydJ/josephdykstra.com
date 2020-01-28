@echo off

pushd C:\Users\Joseph\Github\josephdykstra.com\generator

"C:\Program Files\nodejs\npm.cmd" run build && ^
wkhtmltopdf ./josephdykstra.com_gh-pages/resume-pdf.html ./josephdykstra.com_gh-pages/resume.pdf && ^
cp ./josephdykstra.com_gh-pages/resume.pdf ../content/resume.pdf && ^
start http://localhost/josephdykstra.com/generator/josephdykstra.com_gh-pages/ && ^
popd && ^
sleep 5
