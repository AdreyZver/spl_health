import instance from './ApiInstance';
import { baseApiOmUrl, OM_ADMIN_LOGIN, OM_ADMIN_PASSWORD } from '../config';
const {UserServiceApi, RoomServiceApi, GroupServiceApi, Configuration} = require("openmeetings-node-client");

export const RegisterAPI = {
  register: (data) => {
    return instance.post(
      '/auth/register',
      data,
    ).then((response) => {
      return response;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },
}

export const LoginAPI = {
  login: (data) => {
    return instance.post(
      '/auth/login',
      data,
    ).then((response) => {
      return response;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },
}

export const CategoriesAPI = {
  getCategories: () => {
    return instance.get(
      '/categories',
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  }
}

export const ProgramsAPI = {
  getCategoryPrograms: ({ categoryId }) => {
    return instance.get(
      `/programs`,
      { params: { category_id: categoryId } }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  getProgramIndicators: ({ programId }) => {
    return instance.get(
      `/programs/${programId}/indicators`,
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  startProgram: ({ programId }) => {
    return instance.post(
      `/programs/${programId}/start`,
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },
}

export const LessonsAPI = {
  getLessons: ({ programId }) => {
    return instance.get(
      '/lessons',
      { params: { program_id: programId } }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  completeLesson: ({ lessonId }) => {
    return instance.post(
      `/lessons/${lessonId}/complete`,
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  saveLessonIndicators: ({ lessonId, indicators }) => {
    return instance.post(
      `/lessons/${lessonId}/indicators`,
      { indicators }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },
}

export const UserAPI = {
  getUserPrograms: () => {
    return instance.get(
      '/user/programs'
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  getUserProgramIndicators: ({ programId }) => {
    return instance.get(
      '/user/indicators',
      { params: { program_id: programId } }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  getUserInfo: () => {
    return instance.get(
      '/user/info',
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  udpateUserInfo: ({
    birthDate,
    gender,
    phone,
    country,
    city,
    interests,
    aboutMe,
  }) => {
    return instance.post(
      `/user/info/update`,
      {
        birth_date: birthDate,
        gender: gender,
        phone: phone,
        country: country,
        city: city,
        interests: interests,
        about_me: aboutMe,
      }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

}

export const OrganizationAPI = {
  getPrograms: ({
    view
  }) => {
    return instance.get(
      '/organization/programs',
      { params: { view } }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  createProgram:  ({ programName, categoryId, programDescription }) => {
    return instance.post(
      `/organization/programs/create`,
      {
        program_name: programName,
        program_description: programDescription,
        category_id: categoryId
      }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  getProgram: ({ programId }) => {
    return instance.get(
      `/organization/programs/${programId}`,
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  updateProgram: ({
    programId,
    programName,
    categoryId,
    programDescription
  }) => {
    return instance.put(
      `/organization/programs/${programId}/update`,
      {
        program_name: programName,
        program_description: programDescription,
        category_id: categoryId
      }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  updateProgramLessons: ({
    programId,
    lessons
  }) => {
    return instance.post(
      `/organization/programs/${programId}/update-lessons`,
      { lessons }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  updateProgramIndicators: ({
    programId,
    indicators
  }) => {
    return instance.post(
      `/organization/programs/${programId}/update-indicators`,
      { indicators }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  deleteProgram: ({
    programId,
  }) => {
    return instance.post(
      `/organization/programs/${programId}/delete`,
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  restoreProgram: ({
    programId,
  }) => {
    return instance.post(
      `/organization/programs/${programId}/restore`,
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  udpateProgramIsPublished: ({
    programId,
    isPublished
  }) => {
    return instance.post(
      `/organization/programs/${programId}/update-published`,
      { is_published: isPublished }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  getOrganizationInfo: () => {
    return instance.get(
      `/organization/info`,
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },

  udpateOrganizationInfo: ({
    logo,
    phone,
    address,
    description,
    contacts,
  }) => {
    const formData = new FormData();

    formData.append('logo', logo);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('contacts', JSON.stringify(contacts));

    return instance.post(
      `/organization/info/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  },
}

export const CalendarAPI = {
  loadNotes : () => {
    return instance.get('/calendar/notes');
  },

  createNote: (noteData) => {
    return instance.post('/calendar/notes', noteData);
  },

  updateNote: (id, editContent) => {
    return instance.put(`/calendar/notes/${id}`, {
                content: editContent
            });
  },

  deleteNote: (id) => {
    return instance.delete(`/calendar/notes/${id}`);
  }
}

class OpenMeetingsAPI {
  constructor(login, password) {
    this._login = login;
    this._password = password;
    this._BASE_URL = baseApiOmUrl;
    this._config = new Configuration({
      basePath: this._BASE_URL + "/services"
    });
  }

  #randomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async #loginToService() {
    const userService = new UserServiceApi(this._config);

    const loginResult = await userService.login(this._login, this._password).then(value => {
        return {
            message: value.data.serviceResult.message,
            type: value.data.serviceResult.type
        };
    }).catch(error => {
        return {
            message: error.message,
            type: 'ERROR'
        };
    });

    return loginResult;
  }

  async getRoomHash(user, isOrdinary, lesson) {

    // **********************************************************************
    //                        Login to service
    // **********************************************************************

    const loginResult = await this.#loginToService(this._login, this._password);

    if (loginResult.type != "SUCCESS") {
      return {
        message: "Login error: " + loginResult.message,
        type: "ERROR"
      }
    }

    const sessionId = loginResult.message;

    // **********************************************************************
    //                        Get room hash
    // **********************************************************************
    const userService = new UserServiceApi(this._config);

    const publicRoomData = await this.#getPublicRoom(lesson);
    const guestGroupData = await this.#getGuestGroup();

    if (publicRoomData.type == "ERROR") {
      return {
        message: "Public room data is not correct",
        type: "ERROR"
      }
    }

    if (guestGroupData.type == "ERROR") {
      return {
        message: "Guest group data is not correct",
        type: "ERROR"
      }
    }

    const hashResult = await userService.getRoomHash(sessionId, {
        firstname: `${user.name}`,
        lastname: `${user.surname}`,
        externalId: "uniqueId__" + this.#randomString(10),
        externalType: guestGroupData.group.name,
        login: `${user.username}`,
        email: `${user.email}`
    }, {
        roomId: publicRoomData.id,
        moderator: isOrdinary ? false : true
    }).then(value => {
        return {
            message: value.data.serviceResult.message,
            type: value.data.serviceResult.type
        };
    }).catch(error => {
        return {
            message: error.message,
            type: 'ERROR'
        };
    });
    
    if (hashResult.type === "SUCCESS") {
        const loginUrl = `${this._BASE_URL}/hash?secure=${hashResult.message}`
        return {
          message: loginUrl,
          type: "SUCCESS"
        }
    } else {
        return {
          message: hashResult.message,
          type: "ERROR"
        }
    }
  }

  async #getPublicRoom(lesson) {
    // **********************************************************************
    //                        Login to service
    // **********************************************************************
    const loginResult = await this.#loginToService(this._login, this._password);

    if (loginResult.type != "SUCCESS") {
      return {
        message: "Login error: " + loginResult.message,
        type: "ERROR"
      }
    }

    const sessionId = loginResult.message;

    // **********************************************************************
    //                        Get public room
    // **********************************************************************

    const roomService = new RoomServiceApi(this._config);

    const rooms = await roomService.getPublic(sessionId,'CONFERENCE').then(value => {
      return {
        rooms: value.data.roomDTO,
        type: "SUCCESS"
      }
    }).catch(error => {
      return {
        message: "getRoomsError:" + error.message,
        type: "ERROR"
      }
    });

    if (rooms.type == "SUCCESS") {
      const roomsUid = rooms.rooms.filter(elem => elem.externalId == "program_id__" + `${lesson.programs_id}__` + "lesson_id__" + `${lesson.id}`);
      const roomUid = roomsUid.pop();

      if (typeof roomUid === "undefined") {
        return {
          message: "Room not find",
          type: "ERROR",
        }
      } else {
        return roomUid;
      }
    } else {
      return rooms;
    }
  }

  async #getGuestGroup() {
    // **********************************************************************
    //                        Login to service
    // **********************************************************************

    const loginResult = await this.#loginToService(this._login, this._password);

    if (loginResult.type != "SUCCESS") {
      return {
        message: "Login error: " + loginResult.message,
        type: "ERROR"
      }
    }

    const sessionId = loginResult.message;

    // **********************************************************************
    //                        Get guest group
    // **********************************************************************
    const groupService = new GroupServiceApi(this._config);

    const groups = await groupService.get1(sessionId).then(value => {
      return {
        groups: value.data.groupDTO,
        type: "SUCCESS"
      }
    }).catch(error => {
      return {
        message: "Groups get error: " + error.message,
        type: "ERROR"
      }
    });

    if (groups.type == "SUCCESS") {
      for (let i = 0; i < groups.groups.length; i++) {
        if (groups.groups[i].name == "Guest" && groups.groups[i].tag == "For guests") 
          return {
            group: groups.groups[i],
            type: "SUCCESS"
          }
      }
    } else {
      return groups;
    }
  }

  async createNewRoom(room) {
    // **********************************************************************
    //                        Login to service
    // **********************************************************************

    const loginResult = await this.#loginToService(this._login, this._password);

    if (loginResult.type != "SUCCESS") {
      return {
        message: "Login error: " + loginResult.message,
        type: "ERROR"
      }
    }

    const sessionId = loginResult.message;

    // **********************************************************************
    //                        Create room
    // **********************************************************************
    const roomService = new RoomServiceApi(this._config);

    const addRoomResult = await roomService.add2(sessionId, room).then(value => {
      return {
        newRoomData: value.data.roomDTO,
        type: "SUCCESS",
      }
    }).catch(error => {
      return {
        message: "Create room error: " + error,
        type: "ERROR",
      }
    });

    return addRoomResult;
  }
}

export const openMeetingsAPI = new OpenMeetingsAPI(OM_ADMIN_LOGIN, OM_ADMIN_PASSWORD);





















