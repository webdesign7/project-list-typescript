
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        templateElement: HTMLTemplateElement;
        hostElement: T;
        element: U;
    
        constructor(
          templateId: string,
          hostElementId: string,
          atTheBegining: boolean,
          newElementId?: string
        ) {
          this.templateElement = document.getElementById(
            templateId
          )! as HTMLTemplateElement;
          this.hostElement = document.getElementById(hostElementId)! as T;
    
          const importedNode = document.importNode(
            this.templateElement.content,
            true
          );
          this.element = importedNode.firstElementChild as U;
          if (newElementId) {
            this.element.id = newElementId;
          }
    
          this.attach(atTheBegining);
        }
    
        private attach(atTheBegining: boolean) {
          this.hostElement.insertAdjacentElement(
            atTheBegining ? "afterbegin" : "beforeend",
            this.element
          );
        }
    
        abstract configure(): void;
        abstract renderContent(): void;
      }
