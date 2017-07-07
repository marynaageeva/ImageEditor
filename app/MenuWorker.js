export class MenuWorker {
    constructor(root) {
        this.root = root;
        this.loadSubmenuItems();
        this.activeIndex = 3;

    }
    setActiveItem(index) {
        this.subMenuItems[this.activeIndex].classList.remove('open');
        this.subMenuItems[index].classList.add('open');
        this.activeIndex = index;
    }

    loadSubmenuItems() {
        this.subMenuItems = [];
        for (let i = 0; i < this.root.children.length; i++) {
            this.subMenuItems.push(this.root.children[i]);
        }
    }
}
