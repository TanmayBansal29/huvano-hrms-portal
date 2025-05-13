exports.validateJobPostInput = (data) => {
    const errors = [];

    if(!data.title || !data.jobDescription || !data.rolesAndResponsibilities || !data.skillsRequired || !data.location
        || !data.experienceLevel || !data.positionType || !data.educationLevel || !data.positionType || !data.educationLevel || !data.salary) {
            errors.push("All fields are required")
    }

    if(!data.title || data.title.trim().length < 5 || data.title.trim().length > 100){
        errors.push("Title must be between 5 and 100 characters of length")
    }

    if(!data.jobDescription || data.jobDescription.trim().length < 100 || data.jobDescription.trim().length > 500){
        errors.push("Job Description must be between 100 and 500 characters of length")
    }

    if(!data.rolesAndResponsibilities || data.rolesAndResponsibilities.trim().length < 100 || data.rolesAndResponsibilities.trim().length > 500){
        errors.push("Roles and Responsibilities must be between 100 and 500 characters of length")
    }

    if(!data.skillsRequired || data.skillsRequired.trim().length < 100 || data.skillsRequired.trim().length > 500){
        errors.push("Roles and Responsibilities must be between 100 and 500 characters of length")
    }

    if(!data.location || !["Bangalore", "Hyderabad", "Chennai", "Gurgaon", "Noida", "Pan India", "Kolkata", "Delhi", "Remote", "Ahmedabad"].includes(data.location)){
        errors.push("Location is Not Available")
    }

    if(!data.experienceLevel || !["Intern","0-2", "3-5", "6-8", "8+"].includes(data.experienceLevel)){
        errors.push("Experience Level is Invalid")
    }

    if(!data.positionType || !["Full Time", "Part Time", "Intenship"].includes(data.positionType)){
        errors.push("Position type is Invalid")
    }

    if(!data.educationLevel || !["Graduation", "Post Graduation", "Diploma", "PHD", "None"].includes(data.educationLevel)){
        errors.push("Education Level is Invalid")
    }

    if(typeof data.salary !== "number" || data.salary < 0) {
        errors.push("Salary must be a positive number")
    }
}