import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "nifty",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: `The unique identifier for the App. On Nifty, a new app can be created by following these steps:
1. Access Profile Settings > App Center > Integrate with API > Create a new App.
2. In the Create App popup, add the following Pipedream Redirect URL to the Redirect URLs: \`https://api.pipedream.com/connect/oauth/oa_aWyi2m/callback\`.
3. Make sure to enable the app scopes that are relevant to the source you are creating. For instance, if you are creating a New Task Created source, you will need to enable the Tasks app scope.`,
      async options({ page }) {
        const { apps } = await this.listApps({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return apps.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The unique identifier for the member that the task will be assigned",
      async options() {
        const members = await this.listMembers();

        return members.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier for the project",
      async options({ page }) {
        const { projects } = await this.listProjects({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The unique identifier for the task",
      async options({
        page, projectId,
      }) {
        const { tasks } = await this.listTasks({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            project_id: projectId,
          },
        });

        return tasks.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier for the template",
      async options({ page }) {
        const { items } = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            type: "project",
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    milestoneId: {
      type: "string",
      label: "Milestone ID",
      description: "The unique identifier of a milestone",
      optional: true,
      async options({
        page, projectId,
      }) {
        const { items } = await this.listMilestones({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            project_id: projectId,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskGroupId: {
      type: "string",
      label: "Task Group ID",
      description: "The unique identifier of a task group",
      async options({
        page, projectId,
      }) {
        const { items } = await this.listTaskGroups({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            project_id: projectId,
            archived: false,
          },
        });

        return items?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    labelIds: {
      type: "string[]",
      label: "Label IDs",
      description: "An array of unique identifiers for the labels",
      optional: true,
      async options({ page }) {
        const { items } = await this.listLabels({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            type: "others",
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://openapi.niftypm.com/api/v1.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listApps(opts = {}) {
      return this._makeRequest({
        path: "/apps",
        ...opts,
      });
    },
    listChats(opts = {}) {
      return this._makeRequest({
        path: "/chats",
        ...opts,
      });
    },
    listDocs(opts = {}) {
      return this._makeRequest({
        path: "/docs",
        ...opts,
      });
    },
    listFiles(opts = {}) {
      return this._makeRequest({
        path: "/files",
        ...opts,
      });
    },
    listMembers(opts = {}) {
      return this._makeRequest({
        path: "/members",
        ...opts,
      });
    },
    listMessages(opts = {}) {
      return this._makeRequest({
        path: "/messages",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...opts,
      });
    },
    listMilestones(opts = {}) {
      return this._makeRequest({
        path: "/milestones",
        ...opts,
      });
    },
    listTaskGroups(opts = {}) {
      return this._makeRequest({
        path: "/taskgroups",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    listLabels(opts = {}) {
      return this._makeRequest({
        path: "/labels",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    createProject(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...opts,
      });
    },
    assignTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tasks/${taskId}/assignees`,
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
  },
};
