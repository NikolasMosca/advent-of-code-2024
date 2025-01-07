export class ComputerGroups {
  constructor(connections) {
    this.connections = connections;
    this.groups = [];
    this.rooms = [];
    this.computers = new Map();
  }

  generate() {
    this.connections.forEach(([pc1, pc2]) => {
      this.updateComputer(pc1, pc2);
      this.updateComputer(pc2, pc1);
      this.rooms.push([pc1, pc2]);
    });
    [...this.computers.keys()].forEach((pc) => {
      const groups = this.getConnectionComputer(pc);
      this.groups = [...this.groups, ...groups];
    });
    this.groups = [...new Set(this.groups.toSorted())];
  }

  getConnectionComputer(pc) {
    return this.computers.get(pc).reduce((prev, pc2) => {
      const connectionPc2 = this.computers.get(pc2);
      if (!connectionPc2.includes(pc)) {
        return prev;
      }
      const pc3List = [...this.computers.keys()].filter((pc3) => {
        const connectionPc3 = this.computers.get(pc3);
        return connectionPc3.includes(pc) && connectionPc3.includes(pc2);
      });
      pc3List.forEach((pc3) => prev.push([pc, pc2, pc3].toSorted().join(",")));
      return prev;
    }, []);
  }

  updateComputer(pc, pc2) {
    if (this.computers.has(pc)) {
      this.computers.set(pc, [...this.computers.get(pc), pc2]);
    } else {
      this.computers.set(pc, [pc2]);
    }
  }

  findGroup(term) {
    return this.groups.filter((group) =>
      group.split(",").find((pc) => pc.startsWith(term))
    );
  }

  getLargestGroup() {
    const pcList = [...this.computers.keys()];
    pcList.forEach((pc) => {
      nextRoom: for (let i = 0; i < this.rooms.length; i++) {
        const room = this.rooms[i];
        for (let j = 0; j < room.length; j++) {
          const pcInRoom = room[j];
          const pcConnections = this.computers.get(pcInRoom);
          if (!pcConnections.includes(pc)) {
            continue nextRoom;
          }
        }
        this.rooms[i].push(pc);
      }
    });
    const [largestGroup] = [
      ...new Set(this.rooms.map((room) => room.toSorted().join(","))),
    ].toSorted((a, b) => (a.length > b.length ? -1 : 1));
    return largestGroup;
  }
}
