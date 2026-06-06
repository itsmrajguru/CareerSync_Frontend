import api from '../api';

/* function to upload the student profile photo
it sends the file to the backend which stores it on cloudinary
and returns the saved url */
export const uploadAvatar = async (file) => {
    // create a form data object and append the avatar image file
    const formData = new FormData();
    formData.append('avatar', file);
    return api.put('students/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

/* function to upload the student resume pdf
the url is saved on the profile and auto filled when applying for jobs */
export const uploadResumePDF = async (file) => {
    // create a form data object and append the pdf file
    const formData = new FormData();
    formData.append('resume', file);
    return api.put('students/me/resume-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

/* function to upload the company logo image
the returned url is saved to the company profile */
export const uploadCompanyLogo = async (file) => {
    // create a form data object and append the logo image file
    const formData = new FormData();
    formData.append('logo', file);
    return api.put('companies/me/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
