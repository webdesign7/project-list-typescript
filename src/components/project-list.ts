import { autobind } from "../decorators/autobind.js";
import { DragTarget } from "../model/drag-drop-interfaces.js";
import { Project, ProjectStatus } from "../model/project-model.js";
import { projectState } from "../project-state.js";
import { Component } from "./base-components.js";
import { ProjectItem } from "./project-item.js";

  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, type + "-projects");
      this.assignedProjects = [];
      this.configure();
      this.renderContent();

    }
    @autobind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const el = this.element.querySelector("ul")!;
        el.classList.add("droppable");
      }
    }

    @autobind
    dropHandler(event: DragEvent): void {
      const projId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        projId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
      const el = this.element.querySelector("ul")!;
      el.classList.remove("droppable");
    }

    private renderProjects() {
      const listEl = document.getElementById(
        this.type + "-projects-list"
      )! as HTMLUListElement;

      listEl.innerHTML = "";

      for (const projectItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
      }
    }

    configure(): void {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((pr) => {
          if (this.type === "active") {
            return pr.status === ProjectStatus.Active;
          }

          return pr.status === ProjectStatus.Finished;
        });

        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = this.type + "-projects-list";
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }
  }
