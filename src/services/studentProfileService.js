import api from "../api";

// These functions calls the student profile Routes
export async function getProfileList() {
  return api.get('/students'); 
}
export async function getProfile(id) {
  return api.get(`/students/me`); 
}
export async function createProfile(data) {
  return api.post('/students', data);
}
export async function updateProfile(id, data) {
  return api.put(`/students/me`, data);
}
export async function deleteProfile(id) {
  return api.delete(`/students/me`);
}


// Resume function calls backend routes
export async function uploadResume(file) {
  /*pass this file to the formData
    where formData is the tool used to carry binary file to the backend */

      //step 1 :define formData
      const formData = new FormData()

      //step 2: append file in the formData
      formData.append('resume',file)

      //call resumeController
      return api.post('/students/me/resume',formData,{
        headers:{'Content-Type': 'multipart/form-data'}
      })

}

/* function for the students to get their applied jobs info */
export async function getMyApplications() {
  return api.get('/applications/mine');
}
