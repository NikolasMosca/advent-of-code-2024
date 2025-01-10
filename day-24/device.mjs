import redis from "redis";

export class Device {
  constructor({ initialValues, operations, simulation = false }) {
    this.values = initialValues;
    this.operations = operations;
    this.cache = new Map();
    this.xyCache = new Map();
    this.zCache = new Map();
    this.cableToChange = new Map();
    this.simulation = simulation;

    if (!this.simulation) {
      console.log("Redis inizializzato");
      this.swapTried = redis.createClient({
        socket: {
          host: "127.0.0.1",
          port: 6379,
        },
      });
    }

    // Save cache
    this.operations.forEach(({ result, fields }) => {
      const foundXY = fields.filter(
        (field) => field.startsWith("x") || field.startsWith("y")
      );
      if (foundXY.length > 0) {
        foundXY.forEach((field) => {
          this.xyCache.set(field, [...(this.xyCache.get(field) ?? []), result]);
        });
      }
      this.cache.set(result, fields);
    });
    [...this.xyCache.keys()].map((key) => {
      this.xyCache
        .get(key)
        .forEach((cable) =>
          this.cableToChange.set(cable, [...(this.cableToChange.get(cable) ?? []), key])
        );
    });
  }

  // Verifico se ho ancora operazioni da svolgere
  hasOperationsToResolve() {
    return !!this.operations.find(({ completed }) => !completed);
  }

  // Recupero tutte le operazioni che posso svolgere
  getResolvableOperations() {
    return this.operations.filter(({ fields, completed }) => {
      if (completed) return false;
      if (!fields.every((field) => this.hasValue(field))) return false;
      return true;
    });
  }

  // Controlla se ho un determinato valore di una variabile
  hasValue(field) {
    return this.values[field] !== undefined;
  }

  // Restituisce il valore della variabile
  getValue(field) {
    return this.values[field];
  }

  // Imposta il nuovo valore sulla variabile
  setValue(field, value) {
    this.values[field] = value;
  }

  // Esegui l'operazione richiesta e salva il risultato
  execute({ fields, operator, result, operationIndex }) {
    const [first, second] = fields;
    this.setValue(
      result,
      {
        AND: this.getValue(first) && this.getValue(second),
        OR: this.getValue(first) || this.getValue(second),
        XOR: this.getValue(first) ^ this.getValue(second),
      }[operator]
    );

    // Segno come completata l'operazione
    this.operations[operationIndex].completed = true;
  }

  // Somma alfabeticamente tutti i bit e ritorna il suo valore decimale
  getDecimalResult(key = "z") {
    const binaryNumber = Object.keys(this.values)
      .filter((field) => field.startsWith(key))
      .toSorted()
      .reduce((prev, field) => `${this.getValue(field)}${prev}`, "");
    return parseInt(binaryNumber, 2);
  }

  //Ottieni il nome della variabile corretto passando il valore
  getFieldName(field, value) {
    return `${field}${value < 10 ? `0${value}` : value}`;
  }

  // Calcola i valori di z (parte 2)
  calculateZValues() {
    // Ottengo la somma dei numeri in modalità decimale
    const x = this.getDecimalResult("x");
    const y = this.getDecimalResult("y");
    const z = x + y;

    // Converto in binario e salvo ciascuna posizione del bit nelle z
    [...z.toString(2)].forEach((value, index, list) => {
      this.setValue(this.getFieldName("z", list.length - index - 1), value);
    });
  }

  // Esegue il device
  resolve() {
    while (this.hasOperationsToResolve()) {
      this.getResolvableOperations().forEach((data) => this.execute(data));
    }
  }

  // Effettuo swap per parte 2
  async swap() {
    if (!this.simulation) {
      console.log("Tentativo di connessione...");
      await this.swapTried.connect();
      console.log("Connessione riuscita!");
    }

    this.zResults = [...this.cache.keys()]
      .filter((field) => field.startsWith("z"))
      .filter(
        (field) =>
          this.hasValue(field.replace("z", "x")) && this.hasValue(field.replace("z", "y"))
      )
      .toSorted()
      .map((key) => {
        const fields = [...new Set(this.callback(this.cache.get(key)).flat())].toSorted();
        const zValue = key.replace("z", "");
        let xValue = false;
        let yValue = false;
        for (let i = 0; i < fields.length; i++) {
          if (fields[i].startsWith("x") && fields[i].replace("x", "") === zValue) {
            xValue = true;
          }
          if (fields[i].startsWith("y") && fields[i].replace("y", "") === zValue) {
            yValue = true;
          }
        }
        return {
          key,
          foundX: xValue,
          foundY: yValue,
          fields,
        };
      })
      .filter(({ foundX, foundY }) => !foundX || !foundY);

    if (this.simulation) {
      return true;
    }

    const zKeys = [...this.cache.keys()].filter((key) => key.startsWith("z"));
    zKeys.forEach((key) => {
      let currentKey = key;
      let item = [];
      for (let i = 0; i < 4; i++) {
        if (!this.cache.has(currentKey)) {
          break;
        }
        item = this.cache.get(currentKey);
        currentKey = item[0];
      }
      if (!item[0].startsWith("x") && !item[0].startsWith("y")) {
        this.zCache.set(item[0], key);
      }
      if (!item[1].startsWith("x") && !item[1].startsWith("y")) {
        this.zCache.set(item[1], key);
      }

      for (let i = 0; i < 4; i++) {
        if (!this.cache.has(currentKey)) {
          break;
        }
        item = this.cache.get(currentKey);
        currentKey = item[1];
      }
      if (!item[0].startsWith("x") && !item[0].startsWith("y")) {
        this.zCache.set(item[0], key);
      }
      if (!item[1].startsWith("x") && !item[1].startsWith("y")) {
        this.zCache.set(item[1], key);
      }
    });

    const commonCables = [
      ...new Set(
        [...this.xyCache.values()].flat().filter((field) => this.zCache.has(field))
        // [...this.xyCache.keys()]
        //   .filter((field) =>
        //     this.zResults.find(({ key, foundX, foundY }) => {
        //       return (
        //         (!foundX && key === field.replace("x", "z")) ||
        //         (!foundY && key === field.replace("y", "z"))
        //       );
        //     })
        //   )
        //   .map((key) => this.xyCache.get(key))
      ),
    ]
      .filter((cable) => !cable.startsWith("z"))
      .toSorted();

    return await this.findCableToChange(commonCables);
  }

  sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async findCableToChange(commonCables) {
    await this.sleep(1);
    const randomCables = this.getRandomElements(commonCables, 8);
    // if (this.swapTried.has(randomCables.join(","))) {
    if (await this.swapTried.exists(randomCables.join(","))) {
      return await this.findCableToChange(commonCables);
    }
    const device = new Device({
      initialValues: this.values,
      operations: this.operations,
      simulation: true,
    });

    for (let i = 0; i < randomCables.length; i += 2) {
      const firstKey = randomCables[i];
      const secondKey = randomCables[i + 1];
      const first = this.cache.get(firstKey);
      device.cache.set(firstKey, this.cache.get(secondKey));
      device.cache.set(secondKey, first);
    }
    await device.swap();
    if (device.zResults.length > 0) {
      console.clear();
      console.log(
        randomCables.join(","),
        device.zResults.length,
        await this.swapTried.dbSize()
      );
      await this.swapTried.set(randomCables.join(","), `${device.zResults.length}`);
      return this.findCableToChange(commonCables);
    }
    return randomCables.toSorted().join(",");
  }

  getRandomElements(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  callback(data) {
    if (!data) return [];
    const [first, second] = data;
    let results = [];
    if (this.cache.has(first)) {
      const [f1, f2] = this.cache.get(first);
      results.push(this.callback(this.cache.get(f1)));
      results.push(this.callback(this.cache.get(f2)));
    } else {
      results.push(first);
    }
    if (this.cache.has(second)) {
      const [s1, s2] = this.cache.get(second);
      results.push(this.callback(this.cache.get(s1)));
      results.push(this.callback(this.cache.get(s2)));
    } else {
      results.push(second);
    }
    return results.flat();
  }
}
