import fetch from "node-fetch";

export class TestmoClient {
  constructor(baseUrl, apiToken) {
    if (!baseUrl || !apiToken) {
      throw new Error("TESTMO_URL and TESTMO_TOKEN environment variables are required");
    }
    // Normalize: remove trailing slash, ensure /api/v1
    this.baseUrl = baseUrl.replace(/\/$/, "") + "/api/v1";
    this.apiToken = apiToken;
  }

  async request(method, path, body = null, params = null) {
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== "")
      ).toString();
      if (qs) url += `?${qs}`;
    }

    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Testmo API error ${res.status} ${res.statusText}: ${errText}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  // ─── Projects ────────────────────────────────────────────────────────────
  async getProjects(params = {}) {
    return this.request("GET", "/projects", null, params);
  }

  async getProject(projectId) {
    return this.request("GET", `/projects/${projectId}`);
  }

  // ─── Milestones ───────────────────────────────────────────────────────────
  async getMilestones(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/milestones`, null, params);
  }

  async getMilestone(projectId, milestoneId) {
    return this.request("GET", `/projects/${projectId}/milestones/${milestoneId}`);
  }

  async createMilestone(projectId, data) {
    return this.request("POST", `/projects/${projectId}/milestones`, data);
  }

  async updateMilestone(projectId, milestoneId, data) {
    return this.request("PATCH", `/projects/${projectId}/milestones/${milestoneId}`, data);
  }

  // ─── Test Runs ────────────────────────────────────────────────────────────
  async getRuns(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/runs`, null, params);
  }

  async getRun(projectId, runId) {
    return this.request("GET", `/projects/${projectId}/runs/${runId}`);
  }

  async createRun(projectId, data) {
    return this.request("POST", `/projects/${projectId}/runs`, data);
  }

  async updateRun(projectId, runId, data) {
    return this.request("PATCH", `/projects/${projectId}/runs/${runId}`, data);
  }

  async deleteRun(projectId, runId) {
    return this.request("DELETE", `/projects/${projectId}/runs/${runId}`);
  }

  // ─── Test Results ─────────────────────────────────────────────────────────
  async getResults(projectId, runId, params = {}) {
    return this.request("GET", `/projects/${projectId}/runs/${runId}/tests`, null, params);
  }

  async getResult(projectId, runId, testId) {
    return this.request("GET", `/projects/${projectId}/runs/${runId}/tests/${testId}`);
  }

  // ─── Test Cases (Repository) ─────────────────────────────────────────────
  async getCases(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/cases`, null, params);
  }

  async createCases(projectId, cases) {
    return this.request("POST", `/projects/${projectId}/cases`, { cases });
  }

  async updateCases(projectId, ids, data) {
    return this.request("PATCH", `/projects/${projectId}/cases`, { ids, ...data });
  }

  async deleteCases(projectId, ids) {
    return this.request("DELETE", `/projects/${projectId}/cases`, { ids });
  }

  // ─── Folders ─────────────────────────────────────────────────────────────
  async getFolders(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/folders`, null, params);
  }

  async createFolders(projectId, folders) {
    return this.request("POST", `/projects/${projectId}/folders`, { folders });
  }

  async updateFolders(projectId, ids, data) {
    return this.request("PATCH", `/projects/${projectId}/folders`, { ids, ...data });
  }

  async deleteFolders(projectId, ids) {
    return this.request("DELETE", `/projects/${projectId}/folders`, { ids });
  }

  // ─── Templates, Tags, Fields, Sessions ───────────────────────────────────
  async getTemplates(projectId) {
    return this.request("GET", `/projects/${projectId}/templates`);
  }

  async getTags(projectId) {
    return this.request("GET", `/projects/${projectId}/tags`);
  }

  async getFields(projectId) {
    return this.request("GET", `/projects/${projectId}/fields`);
  }

  async getSessions(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/sessions`, null, params);
  }

  // ─── Users ────────────────────────────────────────────────────────────────
  async getCurrentUser() {
    return this.request("GET", "/user");
  }

  async getUsers(params = {}) {
    return this.request("GET", "/users", null, params);
  }

  async getUser(userId) {
    return this.request("GET", `/users/${userId}`);
  }

  async getProjectUsers(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/users`, null, params);
  }

  // ─── Groups ───────────────────────────────────────────────────────────────
  async getGroups(params = {}) {
    return this.request("GET", "/groups", null, params);
  }

  async getGroup(groupId) {
    return this.request("GET", `/groups/${groupId}`);
  }

  // ─── Roles ────────────────────────────────────────────────────────────────
  async getRoles(params = {}) {
    return this.request("GET", "/roles", null, params);
  }

  async getRole(roleId) {
    return this.request("GET", `/roles/${roleId}`);
  }

  // ─── Automation Runs ──────────────────────────────────────────────────────
  async getAutomationRuns(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/automation/runs`, null, params);
  }

  async getAutomationRun(automationRunId) {
    return this.request("GET", `/automation/runs/${automationRunId}`);
  }

  // ─── Automation Cases ─────────────────────────────────────────────────────
  async getAutomationCases(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/automation/cases`, null, params);
  }

  // ─── Automation Sources ───────────────────────────────────────────────────
  async getAutomationSources(projectId, params = {}) {
    return this.request("GET", `/projects/${projectId}/automation/sources`, null, params);
  }

  async getAutomationSource(automationSourceId) {
    return this.request("GET", `/automation/sources/${automationSourceId}`);
  }

  // ─── Case Attachments ─────────────────────────────────────────────────────
  async getCaseAttachments(caseId, params = {}) {
    return this.request("GET", `/cases/${caseId}/attachments`, null, params);
  }

  async deleteCaseAttachments(caseId, ids) {
    return this.request("DELETE", `/cases/${caseId}/attachments`, { ids });
  }

  // ─── Case Result History ──────────────────────────────────────────────────
  async getCaseResultHistory(projectId, caseId, params = {}) {
    return this.request("GET", `/projects/${projectId}/cases/${caseId}/result-history`, null, params);
  }

  // ─── Sessions (individual) ────────────────────────────────────────────────
  async getSession(sessionId) {
    return this.request("GET", `/sessions/${sessionId}`);
  }

  // ─── Connections ──────────────────────────────────────────────────────────
  async getConnections(params = {}) {
    return this.request("GET", "/issues/connections", null, params);
  }

  // ─── Project Lookup ───────────────────────────────────────────────────────
  async getProjectConfigs(projectId) {
    return this.request("GET", `/projects/${projectId}/configs`);
  }

  async getProjectStates(projectId) {
    return this.request("GET", `/projects/${projectId}/states`);
  }

  async getProjectStatuses(projectId) {
    return this.request("GET", `/projects/${projectId}/statuses`);
  }

  async getProjectMilestoneTypes(projectId) {
    return this.request("GET", `/projects/${projectId}/milestone-types`);
  }

  async getProjectRepos(projectId) {
    return this.request("GET", `/projects/${projectId}/repos`);
  }

  // ─── Automation / CI ─────────────────────────────────────────────────────
  // Testmo uses "threads" to submit automation results
  async createAutomationThread(projectId, runId, data) {
    return this.request("POST", `/projects/${projectId}/runs/${runId}/threads`, data);
  }

  async submitAutomationResults(projectId, runId, threadId, data) {
    return this.request(
      "POST",
      `/projects/${projectId}/runs/${runId}/threads/${threadId}/results`,
      data
    );
  }

  async completeAutomationThread(projectId, runId, threadId, data = {}) {
    return this.request(
      "POST",
      `/projects/${projectId}/runs/${runId}/threads/${threadId}/complete`,
      data
    );
  }
}
