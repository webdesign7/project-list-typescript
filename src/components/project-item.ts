import { autobind } from "../decorators/autobind.js";
import { Draggable } from "../model/drag-drop-interfaces.js";
import { Project } from "../model/project-model.js";
import { Component } from "./base-components.js";

    
    export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable
  {
    private project: Project;

    get person() {
      if (this.project.people === 1) {
        return "1 person";
      } else {
        return `${this.project.people} persons`;
      }
    }

    constructor(hostId: string, project: Project) {
      super("single-project", hostId, false, project.id);
      this.project = project;
      this.configure();
      this.renderContent();
    }
    @autobind
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData("text/plain", this.project.id);
      event.dataTransfer!.effectAllowed = "move";
    }

    dragEndHandler(_: DragEvent): void {
      console.log("Drag endd");
    }

    configure(): void {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent(): void {
      console.log(this.element);

      this.element.querySelector("h2")!.textContent = this.project.title;
      this.element.querySelector("h3")!.textContent = this.person + " assigned";
      this.element.querySelector("p")!.textContent = this.project.description;
    }
  }
