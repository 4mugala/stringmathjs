/*This algorithem hundles mathematical computations in strings*/

class ListX extends Array {
    constructor() {
        super();
    }

    where(value1, value2 = null, s = 0) {
        let value1Pos = this.indexOf(value1, s);
        let value2Pos = this.indexOf(value2, s);
        if (value1Pos >= 0 && value2Pos >= 0) {
            if (value1Pos < value2Pos) {
                return value1Pos;
            } else {
                return value2Pos;
            }
        } else if (value1Pos >= 0 && value2Pos < 0) {
            return value1Pos;
        } else if (value1Pos < 0 && value2Pos >= 0) {
            return value2Pos;
        }
        return null;
    }

    rWhere(value1, value2 = null, s = 0) {
        let value1Pos = this.lastIndexOf(value1, s);
        let value2Pos = this.lastIndexOf(value2, s);
        if (value1 >= 0 && value2 >= 0) {
            if (value1Pos > value2Pos) {
                return value1Pos;
            } else {
                return value2Pos;
            }
        } else if (value1Pos >= 0 && value2Pos < 0) {
            return value1Pos;
        } else if (value1Pos < 0 && value2Pos >= 0) {
            return value2Pos;
        }
        return null;
    }

    head() {
        if (this.length) {
            return this[0];
        } else {
            return null;
        }
    }

    tail() {
        if (this.length) {
            return this[this.length - 1];
        } else {
            return null;
        }
    }

    append(...args) {
        for (let elem of args) {
            if (typeof elem == "object") {
                this.append(...elem);
            } else {
                this.push(elem);
            }
        }
    }

    before(index) {
        if (index > 0) {
            return this[index - 1];
        } else {
            return null;
        }
    }

    after(index) {
        if (index < this.length - 1) {
            return this[index + 1];
        } else {
            return null;
        }
    }
}

class StringMath {
    constructor(expression) {
        if (expression) {
            this.expression = this.beautify(expression);

            this.brackets();
        }
    }

    solve(expression) {
        if (expression) {
            this.expression = this.beautify(expression);
            this.brackets();
        }
    }

    beautify(expression) {
        let newStr = "";
        for (let item of expression) {
            if (["(", ")", "^", "*", "*", "/", "÷", "+", "-"].includes(item)) {
                newStr = newStr.concat(",", item, ",");
            } else {
                newStr = newStr.concat(item);
            }
        }
        let counts = 0;
        let data = newStr.split(",");
        for (let item of data) {
            if (counts != 0) {
                if (item == "(" && /\d+/.test(data[counts - 1])) {
                    data.splice(counts, 0, "*");
                } else if (/\)/.test(item) && /\d+/.test(data[counts + 1])) {
                    data.splice(counts + 1, 0, "*");
                }
            }
            counts += 1;
        }
        let expr = new ListX();
        for (let item of data) {
            if (item) {
                expr.append(item);
            }
        }
        return expr;
    }

    brackets() {
        let closeBracPos = this.expression.where(")", "]");
        let openBracPos = this.expression.rWhere("(", "[", closeBracPos);
        if (openBracPos != null && closeBracPos != null) {
            let innerExpression = this.expression.slice(
                openBracPos + 1,
                closeBracPos
            );
            let innerExprLen = innerExpression.length;
            let answer = new StringMath(innerExpression);
            this.expression.splice(
                openBracPos,
                innerExprLen + 2,
                answer.equals()
            );
            this.brackets();
        }
        this.power();
    }

    power() {
        let powPos = this.expression.where("^");
        let lOperand = this.expression.before(powPos);
        let rOperand = this.expression.after(powPos);

        if (powPos != null) {
            if (lOperand != null && rOperand != null) {
                let exponential = Math.pow(
                    parseFloat(lOperand),
                    parseFloat(rOperand)
                );
                this.expression.splice(powPos - 1, 3, exponential);

                this.power();
            }
        } else {
            this.multiplyAndDivide();
        }
    }

    multiply(operaPos) {
        let lOperand = this.expression.before(operaPos);
        let rOperand = this.expression.after(operaPos);

        if (lOperand != null && rOperand != null) {
            let product = parseFloat(lOperand) * parseFloat(rOperand);
            this.expression.splice(operaPos - 1, 3, product);
        }
        this.multiplyAndDivide();
    }

    divide(operaPos) {
        let lOperand = this.expression.before(operaPos);
        let rOperand = this.expression.after(operaPos);

        if (lOperand != null && rOperand != null) {
            let quotient = parseFloat(lOperand) / parseFloat(rOperand);
            this.expression.splice(operaPos - 1, 3, quotient);
        }
        this.multiplyAndDivide();
    }

    add(operaPos) {
        let lOperand = this.expression.before(operaPos);
        let rOperand = this.expression.after(operaPos);

        if (lOperand != null && rOperand != null) {
            let sum = parseFloat(lOperand) + parseFloat(rOperand);
            this.expression.splice(operaPos - 1, 3, sum);
        }
        this.addAndSubtract();
    }

    subtract(operaPos) {
        let lOperand = this.expression.before(operaPos);
        let rOperand = this.expression.after(operaPos);

        if (lOperand != null && rOperand != null) {
            let difference = parseFloat(lOperand) - parseFloat(rOperand);
            this.expression.splice(operaPos - 1, 3, difference);
        }
        this.addAndSubtract();
    }

    multiplyAndDivide() {
        let mulPos = this.expression.where("*");
        let divPos = this.expression.where("/");

        if (mulPos != null && divPos != null) {
            if (mulPos < divPos) {
                this.multiply(mulPos);
            } else {
                this.divide(divPos);
            }
        } else if (mulPos != null && divPos == null) {
            this.multiply(mulPos);
        } else if (mulPos == null && divPos != null) {
            this.divide(divPos);
        } else {
            this.addAndSubtract();
        }
    }

    addAndSubtract() {
        let addPos = this.expression.where("+");
        let subPos = this.expression.where("-");

        if (addPos != null && subPos != null) {
            if (addPos < subPos) {
                this.add(addPos);
            } else {
                this.subtract(subPos);
            }
        } else if (addPos != null && subPos == null) {
            this.add(addPos);
        } else if (addPos == null && subPos != null) {
            this.subtract(subPos);
        }
    }

    equals() {
        return this.expression.toString();
    }
}

module.exports.StringMath = StringMath;
