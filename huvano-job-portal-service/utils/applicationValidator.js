exports.myInformationValidator = ({country, firstName, lastName, addressLine, city, state, pincode, emailAddress, phoneTypeDevice, phoneNumber, hearAboutUs, formerEmployee}) => {
    let myInformationErrors = []

    // Checking whether candidate added all the details
    if(!country || !firstName || !lastName || !addressLine || !city || !state || !pincode || 
        !emailAddress || !phoneTypeDevice || !phoneNumber || !hearAboutUs || !formerEmployee){
        myInformationErrors.push("Please add all the details")
    }

    // Checking whether the candidate is using the right enum data or not
    const allowedPhoneDevices = ["Home", "Mobile"];
    const allowedHearAbout = ["Glassdoor", "Linkedin", "Indeed", "Naukri", "Social Media", "University", "Career Fair", "Careers Page", "Others"]
    const allowedFormerEmployee = ["Yes", "No"]

    if(!allowedPhoneDevices.includes(phoneTypeDevice)){
        myInformationErrors.push("Please Select a valid phone device")
    }

    if(!allowedHearAbout.includes(hearAboutUs)){
        myInformationErrors.push("Please Select a valid source about hearing about us")
    }

    if(!allowedFormerEmployee.includes(formerEmployee)){
        myInformationErrors.push("Please Select from given options")
    }
    
    // Length Validations
    if(!country || country.trim().length < 2 || country.trim().length > 50){
        myInformationErrors.push("Country Name must be between 2 and 50 characters of length")
    }

    if(!firstName || firstName.trim().length < 2 || firstName.trim().length > 50){
        myInformationErrors.push("First Name must be between 2 and 50 characters of length")
    }

    if(!lastName || lastName.trim().length < 2 || lastName.trim().length > 50){
        myInformationErrors.push("Last Name must be between 2 and 50 characters of length")
    }

    if(!addressLine || addressLine.trim().length < 5 || addressLine.trim().length > 100){
        myInformationErrors.push("Address Line Name must be between 5 and 100 characters of length")
    }

    if(!city || city.trim().length < 2 || city.trim().length > 50){
        myInformationErrors.push("City Name must be between 2 and 50 characters of length")
    }

    if(!state || state.trim().length < 2 || state.trim().length > 50){
        myInformationErrors.push("State Name must be between 2 and 50 characters of length")
    }
}

exports.myEducationValidator = ({degree, field, startYear, endYear, university, cgpa}) => {
    let myEducationErros = []

    // Checking if user added all the details
    if(!degree || !field || !startYear || !endYear || !university || !cgpa) {
        myEducationErros.push("Please add all the fields")
    }

    // Length Validations
    if(!degree || degree.trim().length < 3 || degree.trim().length > 50){
        myEducationErros.push("Degree Name must be between 3 and 50 characters of length")
    }

    if(!field || field.trim().length < 3 || field.trim().length > 50){
        myEducationErros.push("Degree Name must be between 3 and 50 characters of length")
    }

    if(!university || university.trim().length < 3 || university.trim().length > 100){
        myEducationErros.push("University Name must be between 3 and 100 characters of length")
    }

    // CGPA Value Validation
    if(!cgpa || data.cgpa < 0 || cgpa > 10) {
        myEducationErros.push("CGPA value should be between 0 to 10")
    }
}

exports.myExperienceValidator = ({jobTitle, company, fromYear, toYear, currentlyWorking, roleDescription, noticePeriod, currentSalary}) => {
    let myExperienceErrors = []

    // Checking if user has added all the details
    if(!jobTitle || !company || !fromYear || !toYear || !roleDescription) {
        myExperienceErrors.push("Please Enter all the fields")
    }

    // Length Validations
    if(!jobTitle || jobTitle.trim().length < 5 || jobTitle.trim().length > 50){
        myExperienceErrors.push("Job Title must be between 5 and 50 characters of length")
    }

    if(!company || company.trim().length < 5 || company.trim().length > 100){
        myExperienceErrors.push("Job Title must be between 5 and 100 characters of length")
    }

    if(!roleDescription || roleDescription.trim().length < 50 || roleDescription.trim().length > 250){
        myExperienceErrors.push("Role Description must be between 50 and 250 characters of length")
    }
}

exports.applicationQuestionsValidator = ({visaRequirement, relocation, joinImmediately, priorExperience, skills}) => {
    let applicationQuestionErrors = []

    // Checking user entered all the fields or not
    if(!visaRequirement || !relocation || !joinImmediately || !priorExperience || !skills){
        applicationQuestionErrors.push("Please Enter all the details")
    }

    // Checking whether user added ans from allowed Types or not
    const allowedTypes = ["Yes", "No"]

    if(!allowedTypes.includes(visaRequirement)){
        applicationQuestionErrors.push("Please Enter valid answer from options only")
    }

    if(!allowedTypes.includes(relocation)){
        applicationQuestionErrors.push("Please Enter valid answer from options only")
    }
    
    if(!allowedTypes.includes(joinImmediately)){
        applicationQuestionErrors.push("Please Enter valid answer from options only")
    }

    if(!allowedTypes.includes(priorExperience)){
        applicationQuestionErrors.push("Please Enter valid answer from options only")
    }
}

exports.voluntaryQuestionsValidator = ({gender, disability, servedArmy, anyRelativeWorking, governmentOfficial}) => {
    let voluntaryQuestionsErrors = []

    // Checking user entered all fields or not
    if(!gender || !disability || !servedArmy || !anyRelativeWorking || !governmentOfficial){
        voluntaryQuestionsErrors.push("Please Enter all the fields")
    }

    // Checking whether is adding the valid types or not
    const allowedGender = ["Male", "Female", "Others"]
    if(!allowedGender.includes(gender)){
        voluntaryQuestionsErrors.push("Please Enter Valid Gender Type")
    }

    const allowedDiability = ["Yes, I am having a disability", "No, I don't have a disability", "I prefer not to disclose"]
    if(!allowedDiability.includes(disability)){
        voluntaryQuestionsErrors.push("Please select valid answer from options below")
    }

    const allowedTypes = ["Yes", "No"]
    if(!allowedTypes.includes(servedArmy)){
        voluntaryQuestionsErrors.push("Please Enter valid answer from options only")
    }

    if(allowedTypes.includes(governmentOfficial)){
        voluntaryQuestionsErrors.push("Please Enter valid answer from options only")
    }

    if(allowedTypes.includes(anyRelativeWorking)){
        voluntaryQuestionsErrors.push("Please Enter valid answer from options only")
    }
}