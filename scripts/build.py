import config
import os
import shutil
import subprocess
import sys
import time


def buildGoProgram():
    print("===========================================================")
    print("                      \033[1;32;40mBUILD GO\033[0;37;40m")
    print("===========================================================")

    os.chdir(config.srcDir)

    if config.buildType == "debug":
        if config.hostType == "windows":
            os.environ["GOOS"] = "windows"
            cmd = '''go build -o %s.exe main.go''' % (config.genAppDir + os.sep + config.outputFile)
            print(cmd)
            subprocess.call(cmd, shell=True)
        elif config.hostType == "linux":
            os.environ["GOOS"] = "linux"
            cmd = '''go build -o %s main.go''' % (config.genAppDir + os.sep + config.outputFile)
            print(cmd)
            subprocess.call(cmd, shell=True)
            cmd = "chmod 740 %s" % (config.genRootDir + os.sep + config.outputFile)
            subprocess.call(cmd, shell=True)
        else:
            print("Build step is unsupported.")

    elif config.buildType == "release":
        if config.hostType == "windows":
            os.environ["GOOS"] = "windows"
            cmd = '''go build -ldflags "-s -w" -o %s.exe main.go''' % (config.genAppDir + os.sep + config.outputFile)
            print(cmd)
            subprocess.call(cmd, shell=True)

            # Reduce app file size
            cmd = "upx %s.exe" % (config.genAppDir + os.sep + config.outputFile)
            subprocess.call(cmd, shell=True)
        elif config.hostType == "linux":
            os.environ["GOOS"] = "linux"
            cmd = '''go build -ldflags "-s -w" -o %s main.go''' % (config.genAppDir + os.sep + config.outputFile)
            print(cmd)
            subprocess.call(cmd, shell=True)
            cmd = "chmod 740 %s" % (config.genRootDir + os.sep + config.outputFile)
            subprocess.call(cmd, shell=True)

            # Reduce app file size
            cmd = "upx %s" % (config.genAppDir + os.sep + config.outputFile)
            subprocess.call(cmd, shell=True)
        else:
            print("Build step is unsupported.")
    else:
        print("Build step is unsupported.")

    os.chdir(config.rootDir)


def buildPackage():
    print("===========================================================")
    print("                      \033[1;32;40mBUILD PACKAGE\033[0;37;40m")
    print("===========================================================")

    if config.buildType == "debug":
        if config.hostType == "windows":
            src = config.dataDir + os.sep + "config-dev.json"
            shutil.copyfile(src, config.genAppDir + os.sep + "config.json")

            os.makedirs(config.genAppDir + os.sep + "data", exist_ok=True)

            src = config.templateDir + os.sep + "db-template.db"
            shutil.copyfile(src, config.genAppDir + os.sep + "data" + os.sep + "db-template.db")

            src = config.templateDir + os.sep + "log-template.db"
            shutil.copyfile(src, config.genAppDir + os.sep + "data" + os.sep + "log.db")
        elif config.hostType == "linux":
            print("Build type is unsupported.")
        else:
            print("Build type is unsupported.")
    elif config.buildType == "release":
        print("Build type is unsupported.")
    else:
        print("Build type is unsupported.")

    print("\n")


def main(argv):
    start = time.time()
    print("===========================================================")
    print("                      \033[1;32;40mBUILD APPLICATION\033[0;37;40m")
    print("===========================================================")

    print(str(argv))
    config.buildProjectPath(argv[0], argv[1], argv[2])

    buildGoProgram()

    buildPackage()

    elapsedTime = time.time() - start
    print("Running time: %s s" % str(elapsedTime))


if __name__ == '__main__':
    main(sys.argv[1:])
