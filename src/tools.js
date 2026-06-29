import { z } from "zod";

// ─── Shared param schemas ─────────────────────────────────────────────────────

const projectIdParam = { project_id: z.number().int().positive().describe("Testmo project ID") };
const runIdParam = { run_id: z.number().int().positive().describe("Test run ID") };
const paginationParams = {
  page: z.number().int().positive().optional().describe("Page number (default 1)"),
  limit: z.number().int().min(1).max(100).optional().describe("Results per page (max 100)"),
};

// ─── Tool definitions ─────────────────────────────────────────────────────────

export const TOOLS = [
  // ── Projects ──────────────────────────────────────────────────────────────
  {
    name: "list_projects",
    description: "List all Testmo projects accessible to the API token.",
    inputSchema: z.object({ ...paginationParams }),
    handler: async (client, args) => client.getProjects(args),
  },
  {
    name: "get_project",
    description: "Get details of a specific Testmo project by ID.",
    inputSchema: z.object({ ...projectIdParam }),
    handler: async (client, args) => client.getProject(args.project_id),
  },

  // ── Milestones ────────────────────────────────────────────────────────────
  {
    name: "list_milestones",
    description: "List milestones for a project.",
    inputSchema: z.object({ ...projectIdParam, ...paginationParams }),
    handler: async (client, args) => {
      const { project_id, ...params } = args;
      return client.getMilestones(project_id, params);
    },
  },
  {
    name: "get_milestone",
    description: "Get a specific milestone by ID.",
    inputSchema: z.object({
      ...projectIdParam,
      milestone_id: z.number().int().positive().describe("Milestone ID"),
    }),
    handler: async (client, args) => client.getMilestone(args.project_id, args.milestone_id),
  },
  {
    name: "create_milestone",
    description: "Create a new milestone in a project.",
    inputSchema: z.object({
      ...projectIdParam,
      name: z.string().min(1).describe("Milestone name"),
      description: z.string().optional().describe("Optional description"),
      start_on: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      due_on: z.string().optional().describe("Due date (YYYY-MM-DD)"),
    }),
    handler: async (client, args) => {
      const { project_id, ...data } = args;
      return client.createMilestone(project_id, data);
    },
  },
  {
    name: "update_milestone",
    description: "Update an existing milestone.",
    inputSchema: z.object({
      ...projectIdParam,
      milestone_id: z.number().int().positive().describe("Milestone ID"),
      name: z.string().optional().describe("New name"),
      description: z.string().optional().describe("New description"),
      start_on: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      due_on: z.string().optional().describe("Due date (YYYY-MM-DD)"),
      is_completed: z.boolean().optional().describe("Mark milestone as completed"),
    }),
    handler: async (client, args) => {
      const { project_id, milestone_id, ...data } = args;
      return client.updateMilestone(project_id, milestone_id, data);
    },
  },

  // ── Test Runs ─────────────────────────────────────────────────────────────
  {
    name: "list_runs",
    description: "List test runs for a project. Optionally filter by milestone or status.",
    inputSchema: z.object({
      ...projectIdParam,
      ...paginationParams,
      milestone_id: z.number().int().positive().optional().describe("Filter by milestone"),
      status_id: z
        .number()
        .int()
        .optional()
        .describe("Filter by status ID (1=passed, 2=failed, 3=blocked, etc.)"),
    }),
    handler: async (client, args) => {
      const { project_id, ...params } = args;
      return client.getRuns(project_id, params);
    },
  },
  {
    name: "get_run",
    description: "Get details of a specific test run, including stats and status.",
    inputSchema: z.object({ ...projectIdParam, ...runIdParam }),
    handler: async (client, args) => client.getRun(args.project_id, args.run_id),
  },
  {
    name: "create_run",
    description: "Create a new test run in a project.",
    inputSchema: z.object({
      ...projectIdParam,
      name: z.string().min(1).describe("Test run name"),
      description: z.string().optional().describe("Optional description"),
      milestone_id: z.number().int().positive().optional().describe("Associate with a milestone"),
      refs: z.string().optional().describe("References (e.g. Jira ticket IDs, comma-separated)"),
    }),
    handler: async (client, args) => {
      const { project_id, ...data } = args;
      return client.createRun(project_id, data);
    },
  },
  {
    name: "update_run",
    description: "Update an existing test run (rename, change milestone, add refs).",
    inputSchema: z.object({
      ...projectIdParam,
      ...runIdParam,
      name: z.string().optional().describe("New name"),
      description: z.string().optional().describe("New description"),
      milestone_id: z.number().int().positive().optional().describe("New milestone"),
      refs: z.string().optional().describe("Updated references"),
      is_completed: z.boolean().optional().describe("Mark the run as completed"),
    }),
    handler: async (client, args) => {
      const { project_id, run_id, ...data } = args;
      return client.updateRun(project_id, run_id, data);
    },
  },
  {
    name: "delete_run",
    description: "Delete a test run permanently. This cannot be undone.",
    inputSchema: z.object({ ...projectIdParam, ...runIdParam }),
    handler: async (client, args) => {
      await client.deleteRun(args.project_id, args.run_id);
      return { success: true, message: `Run ${args.run_id} deleted.` };
    },
  },

  // ── Test Results ──────────────────────────────────────────────────────────
  {
    name: "list_results",
    description: "List test results (individual test cases) inside a run.",
    inputSchema: z.object({
      ...projectIdParam,
      ...runIdParam,
      ...paginationParams,
      status_id: z.number().int().optional().describe("Filter by status"),
    }),
    handler: async (client, args) => {
      const { project_id, run_id, ...params } = args;
      return client.getResults(project_id, run_id, params);
    },
  },
  {
    name: "get_result",
    description: "Get a single test result by its ID.",
    inputSchema: z.object({
      ...projectIdParam,
      ...runIdParam,
      test_id: z.number().int().positive().describe("Test result ID"),
    }),
    handler: async (client, args) =>
      client.getResult(args.project_id, args.run_id, args.test_id),
  },

  // ── Test Cases (Repository) ───────────────────────────────────────────────
  {
    name: "list_cases",
    description:
      "List test cases in a project repository. Filter by folder/group using folder_id. Supports pagination.",
    inputSchema: z.object({
      ...projectIdParam,
      ...paginationParams,
      folder_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Filter by folder/group ID (visible in the Testmo URL as group_id)"),
    }),
    handler: async (client, args) => {
      const { project_id, ...params } = args;
      return client.getCases(project_id, params);
    },
  },
  {
    name: "create_cases",
    description:
      "Create one or more test cases in a project repository from a PRD, user stories, or acceptance criteria. " +
      "Each case must have a name. Optionally supply folder_id to place cases in a specific folder, " +
      "and custom_description / custom_precondition / custom_expected for structured test steps.",
    inputSchema: z.object({
      ...projectIdParam,
      cases: z
        .array(
          z.object({
            name: z.string().min(1).describe("Test case title"),
            folder_id: z
              .number()
              .int()
              .positive()
              .optional()
              .describe("Folder/group ID to place this case in"),
            custom_description: z
              .string()
              .optional()
              .describe("Test case description or background context"),
            custom_precondition: z
              .string()
              .optional()
              .describe("Preconditions that must be true before the test"),
            custom_expected: z
              .string()
              .optional()
              .describe("Expected result / acceptance criteria"),
          })
        )
        .min(1)
        .describe("Array of test cases to create"),
    }),
    handler: async (client, args) => {
      const { project_id, cases } = args;
      return client.createCases(project_id, cases);
    },
  },
  {
    name: "delete_cases",
    description: "Permanently delete one or more test cases by their IDs. This cannot be undone.",
    inputSchema: z.object({
      ...projectIdParam,
      ids: z
        .array(z.number().int().positive())
        .min(1)
        .describe("Array of test case IDs to delete"),
    }),
    handler: async (client, args) => {
      await client.deleteCases(args.project_id, args.ids);
      return { success: true, message: `Deleted ${args.ids.length} test case(s).` };
    },
  },

  {
    name: "update_cases",
    description:
      "Bulk-update test cases. Use to move cases to a different folder, change priority, or update other shared fields across multiple cases at once.",
    inputSchema: z.object({
      ...projectIdParam,
      ids: z.array(z.number().int().positive()).min(1).describe("IDs of cases to update"),
      folder_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Move all specified cases to this folder"),
      custom_priority: z
        .number()
        .int()
        .min(1)
        .max(3)
        .optional()
        .describe("Priority: 1=High, 2=Normal, 3=Low"),
    }),
    handler: async (client, args) => {
      const { project_id, ids, ...data } = args;
      return client.updateCases(project_id, ids, data);
    },
  },

  // ── Folders ───────────────────────────────────────────────────────────────
  {
    name: "list_folders",
    description:
      "List all folders (groups) in a project repository. Returns folder IDs, names, parent relationships, and case counts. Use this to find folder IDs before creating or moving test cases.",
    inputSchema: z.object({ ...projectIdParam }),
    handler: async (client, args) => client.getFolders(args.project_id),
  },
  {
    name: "create_folders",
    description:
      "Create one or more folders in a project repository to organise test cases. Folders can be nested by specifying a parent_id.",
    inputSchema: z.object({
      ...projectIdParam,
      folders: z
        .array(
          z.object({
            name: z.string().min(1).describe("Folder name"),
            parent_id: z
              .number()
              .int()
              .positive()
              .optional()
              .describe("Parent folder ID for nested folders"),
          })
        )
        .min(1)
        .describe("Folders to create"),
    }),
    handler: async (client, args) => {
      const { project_id, folders } = args;
      return client.createFolders(project_id, folders);
    },
  },
  {
    name: "update_folders",
    description: "Rename one or more folders, or move them under a new parent folder.",
    inputSchema: z.object({
      ...projectIdParam,
      ids: z.array(z.number().int().positive()).min(1).describe("Folder IDs to update"),
      name: z.string().min(1).optional().describe("New name to apply to all specified folders"),
      parent_id: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Move folders under this parent folder ID"),
    }),
    handler: async (client, args) => {
      const { project_id, ids, ...data } = args;
      return client.updateFolders(project_id, ids, data);
    },
  },
  {
    name: "delete_folders",
    description:
      "Permanently delete one or more folders by ID. Any test cases inside the folders will also be deleted. This cannot be undone.",
    inputSchema: z.object({
      ...projectIdParam,
      ids: z.array(z.number().int().positive()).min(1).describe("Folder IDs to delete"),
    }),
    handler: async (client, args) => {
      await client.deleteFolders(args.project_id, args.ids);
      return { success: true, message: `Deleted ${args.ids.length} folder(s).` };
    },
  },

  // ── Templates, Tags, Fields, Sessions ─────────────────────────────────────
  {
    name: "list_templates",
    description:
      "List case templates available in a project (e.g. Case (BDD), Case (steps), Case (text)). Returns template IDs and their field definitions. Use to determine which template_id and field names to use when creating cases.",
    inputSchema: z.object({ ...projectIdParam }),
    handler: async (client, args) => client.getTemplates(args.project_id),
  },
  {
    name: "list_tags",
    description: "List all tags defined in a project, with usage counts.",
    inputSchema: z.object({ ...projectIdParam }),
    handler: async (client, args) => client.getTags(args.project_id),
  },
  {
    name: "list_fields",
    description:
      "List all custom fields configured in a project (for cases, runs, or sessions). Returns field names, types, and options. Use to discover available custom field names before creating or updating cases.",
    inputSchema: z.object({ ...projectIdParam }),
    handler: async (client, args) => client.getFields(args.project_id),
  },
  {
    name: "list_sessions",
    description:
      "List exploratory test sessions for a project. Returns session names, state, assignee, milestone, and timing information.",
    inputSchema: z.object({
      ...projectIdParam,
      ...paginationParams,
    }),
    handler: async (client, args) => {
      const { project_id, ...params } = args;
      return client.getSessions(project_id, params);
    },
  },

  // ── Automation / CI ───────────────────────────────────────────────────────
  {
    name: "start_automation_thread",
    description:
      "Start an automation thread in a run (CI/CD integration). Returns a thread ID used to submit results.",
    inputSchema: z.object({
      ...projectIdParam,
      ...runIdParam,
      name: z.string().optional().describe("Thread name, e.g. 'Chrome / Unit Tests'"),
    }),
    handler: async (client, args) => {
      const { project_id, run_id, ...data } = args;
      return client.createAutomationThread(project_id, run_id, data);
    },
  },
  {
    name: "submit_automation_results",
    description:
      "Submit test results to an automation thread. Pass an array of test case results.",
    inputSchema: z.object({
      ...projectIdParam,
      ...runIdParam,
      thread_id: z.number().int().positive().describe("Thread ID from start_automation_thread"),
      results: z
        .array(
          z.object({
            name: z.string().describe("Test case name"),
            status_id: z
              .number()
              .int()
              .describe("Status: 1=passed, 2=failed, 3=blocked, 4=skipped, 5=untested"),
            duration: z.number().optional().describe("Duration in milliseconds"),
            comment: z.string().optional().describe("Optional comment or error message"),
          })
        )
        .describe("Array of test results to submit"),
    }),
    handler: async (client, args) => {
      const { project_id, run_id, thread_id, results } = args;
      return client.submitAutomationResults(project_id, run_id, thread_id, { results });
    },
  },
  {
    name: "complete_automation_thread",
    description:
      "Mark an automation thread as complete. Call this after all results have been submitted.",
    inputSchema: z.object({
      ...projectIdParam,
      ...runIdParam,
      thread_id: z.number().int().positive().describe("Thread ID to complete"),
    }),
    handler: async (client, args) => {
      const { project_id, run_id, thread_id } = args;
      await client.completeAutomationThread(project_id, run_id, thread_id);
      return { success: true, message: `Thread ${thread_id} completed.` };
    },
  },
];
