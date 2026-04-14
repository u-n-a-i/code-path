// Herencia

class Book {
  constructor(protected title: string, protected pag: number) {
    this.title = title;
    this.pag = pag;
  }

  toString(): string {
    return `
    Title: ${this.title}
    Pag: ${this.pag}
    `;
  }
}

// Solo se puede heredar de una única clase
class BestSeller extends Book {
  private bestSeller: boolean;

  constructor(title: string, pag: number, sales: number) {
    super(title, pag);
    this.bestSeller = sales > 100000;
  }

  toString(): string {
    return `
    Title: ${this.title}
    Pag: ${this.pag}
    Best Seller: ${this.bestSeller ? "Yes" : "No"}
    `;
  }
}

const book1 = new Book("El libro", 200);
console.log(book1.toString());

const book2 = new BestSeller("El cuarto mono", 300, 200000);
console.log(book2.toString());

const book3 = new BestSeller("Billy Summer", 400, 10000);
console.log(book3.toString());
