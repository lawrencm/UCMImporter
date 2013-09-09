
module.exports = {
	ucmImporter:{

		//JAVA_PATH
//		JAVA_HOME: "java",
        JAVA_HOME: "D:/ProgramFiles/Java/jdk1.7.0_21/bin/java",
//		JAVA_HOME: "/usr/bin/java",
		//the start directory for the file crawl
		BASE_Dir : "/helloworld",
		//location of apache tika
		APACHE_TIKA_HOME:"D:/tika-app-1.4.jar",
		// APACHE_TIKA_HOME:"/Users/lawrencm/Downloads/tika-app-1.4.jar",
		//file paths need to start with this string
		FP_START_STR:"/",
		//file paths need to end with this string
		FP_END_STR:"/"
	}
};
