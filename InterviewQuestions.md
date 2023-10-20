1. What is the potential pitfall with using:

**typeof bar === 'object'**

to determine if bar is an object? How can this pitfall be avoided?

*ANSWER*: Although this is a reliable way of checking if bar is an object, the surprising gotcha in JS is that **null** is ALSO an object!

So, the problem can easily be avoided by also checking if bar is null:

<script>
  console.log((bar !== null) && (typeof bar === "object")); //logs false
</script>

There is even a more specific way that would return FALSE for nulls, array, and functions, but TRUE for objects only:

<script>
  console.log((bar !== null) && (bar.constructor === Object)); //logs false
</script>

=======================================================================

2. What will the code below output to the console and why?

<script>
  (function(){
    var a = b = 3;
  })();

  console.log("a defined? " + (typeof a !== 'undefined'));
  console.log("b defined? " + (typeof b !== 'undefined'));
</script>

*ANSWER*:
Since both a and b are defined within the enclosing scope of the function, and since the line they are on begins with the var keyword, most JavaScript developers would expect typeof a and typeof b to both be undefined in the above example.

However, that is not the case. The issue here is that most developers incorrectly understand the statement var a = b = 3; to be shorthand for:

var b = 3;
var a = b;

But in fact, var a = b = 3; is actually shorthand for:

b = 3;
var a = b;

As a result (if you are not using strict mode), the output of the code snippet would be:

a defined? false
b defined? true

But how can b be defined outside of the scope of the enclosing function? Well, since the statement var a = b = 3; is shorthand for the statements b = 3; and var a = b;, b ends up being a global variable (since it is not preceded by the var keyword) and is therefore still in scope even outside of the enclosing function.

=======================================================================

3. What will the code below output to the console and why?

<script>

var myObject = {
    foo: "bar",
    func: function() {
        var self = this;
        console.log("outer func:  this.foo = " + this.foo);
        console.log("outer func:  self.foo = " + self.foo);
        (function() {
            console.log("inner func:  this.foo = " + this.foo);
            console.log("inner func:  self.foo = " + self.foo);
        }());
    }
};
myObject.func();

</script>

*ANSWER*:

The above code will output the following to the console:

outer func:  this.foo = bar
outer func:  self.foo = bar
inner func:  this.foo = undefined
inner func:  self.foo = bar

In the outer function, both **this** and **self** refer to myObject and therefore both can properly reference and access foo.

In the inner function, though, this no longer refers to myObject. As a result, this.foo is undefined in the inner function, whereas the reference to the local variable self remains in scope and is accessible there.

=======================================================================

4. What is the significance of, and reason for, wrapping the entire content of a JavaScript source file in a function block?

*ANSWER*: This is an increasingly common practice, employed by many popular JavaScript libraries (jQuery, Node.js, etc.). This technique creates a closure around the entire contents of the file which, perhaps most importantly, creates a private namespace and thereby helps avoid potential name clashes between different JavaScript modules and libraries.

Another feature of this technique is to allow for an easily referenceable (presumably shorter) alias for a global variable. This is often used, for example, in jQuery plugins. jQuery allows you to disable the $ reference to the jQuery namespace, using jQuery.noConflict(). If this has been done, your code can still use $ employing this closure technique, as follows:

<script>
(function($) { /* jQuery plugin code referencing $ */ } )(jQuery);
</script>

======================================================================

5. What is the significance, and what are the benefits, of including 'use strict' at the beginning of a JavaScipt source file?

*ANSWER*: 

The short and most important answer here is that use strict is a way to voluntarily enforce stricter parsing and error handling on your JavaScript code at runtime. Code errors that would otherwise have been ignored or would have failed silently will now generate errors or throw exceptions. In general, it is a good practice.

Some of the key benefits of strict mode include:

- Makes debugging easier. Code errors that would otherwise have been ignored or would have failed silently will now generate errors or throw exceptions, alerting you sooner to problems in your code and directing you more quickly to their source.
    
- Prevents accidental globals. Without strict mode, assigning a value to an undeclared variable automatically creates a global variable with that name. This is one of the most common errors in JavaScript. In strict mode, attempting to do so throws an error.
    
- Eliminates this coercion. Without strict mode, a reference to a this value of null or undefined is automatically coerced to the global. This can cause many headfakes and pull-out-your-hair kind of bugs. In strict mode, referencing a a this value of null or undefined throws an error.
    
- Disallows duplicate parameter values. Strict mode throws an error when it detects a duplicate named argument for a function (e.g., function foo(val1, val2, val1){}), thereby catching what is almost certainly a bug in your code that you might otherwise have wasted lots of time tracking down.
        Note: It used to be (in ECMAScript 5) that strict mode would disallow duplicate property names (e.g. var object = {foo: "bar", foo: "baz"};) but as of ECMAScript 2015 this is no longer the case.
    
- Makes eval() safer. There are some differences in the way eval() behaves in strict mode and in non-strict mode. Most significantly, in strict mode, variables and functions declared inside of an eval() statement are not created in the containing scope (they are created in the containing scope in non-strict mode, which can also be a common source of problems).
    
- Throws error on invalid usage of delete. The delete operator (used to remove properties from objects) cannot be used on non-configurable properties of the object. Non-strict code will fail silently when an attempt is made to delete a non-configurable property, whereas strict mode will throw an error in such a case.

=======================================================================

6. Consider the two functions below. Will they both return the same thing? Why or why not?

<script>

function foo1()
{
  return {
      bar: "hello"
  };
}

function foo2()
{
  return
  {
      bar: "hello"
  };
}

</script>

*ANSWER*: 

console.log("foo1 returns:");
console.log(foo1());
console.log("foo2 returns:");
console.log(foo2());

will yield:

foo1 returns:
**Object {bar: "hello"}**
foo2 returns:
**undefined**

The reason for this has to do with the fact that semicolons are technically optional in JavaScript (although omitting them is generally really bad form). As a result, when the line containing the return statement (with nothing else on the line) is encountered in foo2(), a semicolon is automatically inserted immediately after the return statement.

No error is thrown since the remainder of the code is perfectly valid, even though it doesn’t ever get invoked or do anything (it is simply an unused code block that defines a property bar which is equal to the string "hello").

This behavior also argues for following the convention of placing an opening curly brace at the end of a line in JavaScript, rather than on the beginning of a new line. As shown here, this becomes more than just a stylistic preference in JavaScript.

========================================================================

7. What will the code below output? Explain your answer.

<script>
console.log(0.1 + 0.2); //0.30000000000000004
console.log(0.1 + 0.2 == 0.3); //false
</script>

*ANSWER*: An educated answer to this question would simply be: “You can’t be sure. it might print out 0.3 and true, or it might not. Numbers in JavaScript are all treated with floating point precision, and as such, may not always yield the expected results.”

A typical solution is to compare the absolute difference between two numbers with the special constant Number.EPSILON:

<script>
function areTheNumbersAlmostEqual(num1, num2) {
	return Math.abs( num1 - num2 ) < Number.EPSILON;
}
console.log(areTheNumbersAlmostEqual(0.1 + 0.2, 0.3));
</script>

=========================================================================

8. In what order will the numbers 1-4 be logged to the console when the code below is executed? Why?

<script>
(function() {
    console.log(1); 
    setTimeout(function(){console.log(2)}, 1000); 
    setTimeout(function(){console.log(3)}, 0); 
    console.log(4);
})();
</script>

*ANSWER*: 1, 4, 3, 2

- 1 and 4 are displayed first since they are logged by simple calls to console.log() without any delay
- 2 is displayed after 3 because 2 is being logged after a delay of 1000 msecs, whereas 3 is being logged after a delay of 0 msecs.
- Some might assume that 3 also gets logged right away, since its being logged after a delay of 0 msecs. But this doesn't happen due to the nature of **JavaScript events and timing**.
- setTimeout() puts an execution of its referenced function into the event queue if the browser is busy. When a value of zero is passed as the second argument to setTimeout(), it attempts to execute the specified function “as soon as possible”. Specifically, execution of the function is placed on the event queue to occur on the next timer tick. Note, though, that this is not immediate; the function is not executed until the next tick. That’s why in the above example, the call to console.log(4) occurs before the call to console.log(3) (since the call to console.log(3) is invoked via setTimeout, so it is slightly delayed).

========================================================================

9. Write a simply function (less than 160 chars) that returns a boolean indicating whether or not a string is a palindrome.

*ANSWER*:

<script>
  function isPalindrome(str) {
    str = str.replace(/\W/g, '').toLowerCase();
    return (str == str.split('').reverse().join(''));
  }
</script>

Tip:  **/\W/g** is used to find all non-word characters (like spaces and punctuation) in the input string str, and it replaces them with an empty string ''. This effectively removes all non-alphanumeric characters from the string.

=========================================================================

10. Write a sum method which will work properly when invoked using either syntax below:
    
    console.log(sum(2,3)); //Outputs 5
    console.log(sum(2)(3)); //Outputs 5

*ANSWER*: 


<script>
// - Method 1: 
  function sum(x) {
    if (arguments.length == 2) {
      return arguments[0] + arguments[1];
    } else {
      return function(y) {
        return x + y;
      };
    }
  }

// - Method 2:
  function sum(x, y) {
    if (y !== undefined) {
      return x + y;
    } else {
      return function(y) { return x + y; };
    }
  }

</script>

=========================================================================
11
=========================================================================
12. Assuming d is an "empty" object in scope, say:

  var d = {};

...what is accomplished using the following code?

<script>
[ 'zebra', 'horse' ].forEach(function(k) {
	d[k] = undefined;
});
</script>

*ANSWER*: 
<script>
 var d = {
  'zebra' : undefined,
  'horse' : undefined
 } 
</script>


The snippet of code shown above sets two properties on the object d. Ideally, any lookup performed on a JavaScript object with an unset key evaluates to undefined. But running this code marks those properties as “own properties” of the object.

This is a useful strategy for ensuring that an object has a given set of properties. Passing this object to Object.keys will return an array with those set keys as well (even if their values are undefined).

=========================================================================

13. What will the code below output to the console and why?

<script>
var arr1 = "john".split('');
var arr2 = arr1.reverse();
var arr3 = "jones".split('');
arr2.push(arr3);
console.log("array 1: length=" + arr1.length + " last=" + arr1.slice(-1));
console.log("array 2: length=" + arr2.length + " last=" + arr2.slice(-1));
</script>

*ANSWER*: 
"array 1: length=5 last=j,o,n,e,s"
"array 2: length=5 last=j,o,n,e,s"

- Calling an array object's reverse() method doesn't only RETURN the array in reverse order, it also revereses the order of the ORIGINAL array ITSELF. 
- The reverse() method returns a reference to the array itself (i.e., in this case, arr1). As a result, arr2 is simply a reference to (rather than a copy of) arr1. Therefore, when anything is done to arr2 (i.e., when we invoke arr2.push(arr3);), arr1 will be affected as well since arr1 and arr2 are simply references to the same object.

PRIMITIVE DATA TYPES (numbers, strings, booleans) STORE THE ACTUAL VALUE/DATA

NON PRIMITIVE DATA TYPES (objects, arrays, functions) STORE REFERENCES TO THE UNDERLYING DATA

=========================================================================

14. What will be output to the console and why?

<script>
console.log(1 +  "2" + "2"); //122
console.log(1 +  +"2" + "2"); //32  unary operator!
console.log(1 +  -"1" + "2"); //02  unary operator!
console.log(+"1" +  "1" + "2"); //112
console.log( "A" - "B" + "2"); //NaN2
console.log( "A" - "B" + 2); //NaN
</script>

The fundamental issue here is that JavaScript (ECMAScript) is a loosely typed language and it performs automatic type conversion on values to accommodate the operation being performed. Let’s see how this plays out with each of the above examples.

=========================================================================

15. The following recursive code will cause a stack overflow if the array list is too large. How can you fix this and still retain the recursive pattern?

<script>
var list = readHugeList();

var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...
        nextListItem();
    }
};
</script>

*ANSWER*:

<script>
var list = readHugeList();

var nextListItem = function() {
    var item = list.pop();

    if (item) {
        // process the list item...
        setTimeout(nextListItem, 0); //THE CHANGE!
    }
};
</script>

The stack overflow is eliminated because the event loop handles the recursion, not the call stack. When nextListItem runs, if item is not null, the timeout function (nextListItem) is pushed to the event queue and the function exits, thereby leaving the call stack clear. When the event queue runs its timed-out event, the next item is processed and a timer is set to again invoke nextListItem. Accordingly, the method is processed from start to finish without a direct recursive call, so the call stack remains clear, regardless of the number of iterations.

=========================================================================

16. What is a 'closure' in JavaScript? Provide example.

*ANSWER*: A closure is an inner function that has access to the variables in the outer (enclosing) function’s scope chain. The closure has access to variables in three scopes; specifically: (1) variable in its own scope, (2) variables in the enclosing function’s scope, and (3) global variables.

Example:
<script>

var globalVar = "xyz";

(function outerFunc(outerArg) {
    var outerVar = 'a';
    
    (function innerFunc(innerArg) {
    var innerVar = 'b';
    
    console.log(
        "outerArg = " + outerArg + "\n" +
        "innerArg = " + innerArg + "\n" +
        "outerVar = " + outerVar + "\n" +
        "innerVar = " + innerVar + "\n" +
        "globalVar = " + globalVar);
    
    })(456);
})(123);

</script>

=========================================================================

17. What would the following lines of code output?

<script>
console.log("0 || 1 = "+(0 || 1)); // 1
console.log("1 || 2 = "+(1 || 2)); // 1
console.log("0 && 1 = "+(0 && 1)); // 0
console.log("1 && 2 = "+(1 && 2)); // 2
</script>

=========================================================================

18. What will be the output when the following code is executed?

<script>
console.log(false == '0') //true
console.log(false === '0') //false
</script>

'===' CHECKS FOR SAME TYPE AND SAME VALUE
'==' VALUES ARE COERCED BEFORE COMPARING

=========================================================================

19. What would the following lines of code output?

<script>
  var a={},
    b={key:'b'},
    c={key:'c'};

a[b]=123;
a[c]=456;

console.log(a[b]);
</script>

var a = {
  '[object Object]' : 123, //this happens first
  '[object Object]' : 456 //this overides the previous
}

so...

var a = {
  '[object Object]' : 456
}

*ANSWER*: 456. This happens becuase JS will implicitly stringify the parameter value. Since both b and c are object, they BOTH are converted to '[object Object]'. So when c is set in the object, it overides b.

=========================================================================

20. What would the following lines of code output to console?

<script>
 console.log((function f(n){
  return (
    (n > 1) ? n * f(n-1) : n
    )
  })(10)); 
</script>

10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1 = 3,628,800

*ANSWER*: 3,628,800 (which is 10!)

=========================================================================

21. What would the following lines of code output to console?

<script>
  (function(x) {
    return (function(y) {
        console.log(x);
    })(2)
})(1);
</script>

*ANSWER*: 1

Example of closure.

=========================================================================

22. What would the following lines of code output to console?

<script>
  var hero = {
    _name: 'John Doe',
    getSecretIdentity: function (){
        return this._name;
    }
};

var stoleSecretIdentity = hero.getSecretIdentity;

console.log(stoleSecretIdentity());
console.log(hero.getSecretIdentity());
</script>

*ANSWER*: this will output:

undefined
John Doe

The first console.log prints undefined because we are extracting the method from the hero object, so stoleSecretIdentity() is being invoked in the global context (i.e., the window object) where the _name property does not exist.

One way to fix the stoleSecretIdentity() function is as follows:

<script>
var stoleSecretIdentity = hero.getSecretIdentity.bind(hero);
</script>

=========================================================================

23. Create a function that, given a DOM Element on the page, will visit the element itself and all of its descendents (not just its immediate children). For each element visited, the function should pass that element to a provided callback function.

*ANSWER*: Visiting all elements in a tree (DOM) is a classic Depth-First-Search algorithm application. Solution:

<script>
  function Traverse(p_element, p_callback) {
    p_callback(p_element);
    var list = p_element.children;
    for (var i = 0; i < list.length; i++) {
      Traverse(list[i], p_callback); //recursive call
    }
  }
</script>

=========================================================================

24. **THIS** KNOWLEDGE TEST. What is the output of the following code?

<script>
var length = 10;
function fn() {
	console.log(this.length);
}

var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};

obj.method(fn, 1);
</script>

*ANSWER*: Output:

10
2

Why isn’t it 10 and 5?

In the first place, as fn is passed as a parameter to the function method, the scope (this) of the function fn is window. var length = 10; is declared at the window level. It also can be accessed as window.length or length or this.length (when this === window.)

method is bound to Object obj, and obj.method is called with parameters fn and 1. Though method is accepting only one parameter, while invoking it has passed two parameters; the first is a function callback and other is just a number.

When fn() is called inside method, which was passed the function as a parameter at the global level, this.length will have access to var length = 10 (declared globally) not length = 5 as defined in Object obj.

Now, we know that we can access any number of arguments in a JavaScript function using the arguments[] array.

Hence arguments[0]() is nothing but calling fn(). Inside fn now, the scope of this function becomes the arguments array, and logging the length of arguments[] will return 2.

Hence the output will be as above.

=========================================================================

25. What would the following lines of code output to console?

<script>
  (function () {
    try {
        throw new Error();
    } catch (x) {
        var x = 1, y = 2;
        console.log(x);
    }
    console.log(x);
    console.log(y);
})();
</script>

*ANSWER*: 
1
undefined
2

WHY?:
var statements are hoisted (without their value initialization) to the top of the global or function scope it belongs to, even when it’s inside a with or catch block. However, the error’s identifier is only visible inside the catch block. It is equivalent to:

<script>
  (function () {
    var x, y; // outer and hoisted
    try {
        throw new Error();
    } catch (x /* inner */) {
        x = 1; // inner x, not the outer one
        y = 2; // there is only one y, which is in the outer scope
        console.log(x /* inner */);
    }
    console.log(x);
    console.log(y);
})();
</script>

=========================================================================

26. What will be the ouput of this code?

<script>
var x = 21;
var girl = function () {
    console.log(x);
    var x = 20;
};
girl ();
</script>

*ANSWER*: Neither 21, nor 20, the result is undefined

It’s because JavaScript initialization is not hoisted.

(Why doesn’t it show the global value of 21? The reason is that when the function is executed, it checks that there’s a local x variable present but doesn’t yet declare it, so it won’t look for global one.)

It's as if this is happening:

<script>
var girl = function () {
    var x; // Declaration is hoisted
    console.log(x); // At this point, x is undefined
    x = 20; // Initialization still occurs here
};
</script>

=========================================================================

27. What will this code print?

<script>
  for (let i = 0; i < 5; i++) {
  setTimeout(function() { console.log(i); }, i * 1000 );
}
</script>

*ANSWER*: It will print 0 1 2 3 4, because we use let instead of var here. The variable i is only seen in the for loop’s block scope.

=========================================================================

28. What do the following lines output and why?

<script>
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
</script>

*ANSWER*:

TRUE
FALSE

The first one evaluates to true < 3, which evaluates to 1 < 3, which is TRUE
The second one evaluates to true > 1, which evaluates to 1 > 1, which is FALSE

=========================================================================

29. How do you add an element at the beginning of an array? How do you add one at the end?

*ANSWER*:

Add to beginning: arr.unshift(element)
Add to end: arr.push(element)

OR

myArray = ['start', ...myArray, 'end'];

=========================================================================

30. Imagine you have this code:

var a = [1,2,3];

- Will this result in a crash?

a[10] = 99;

*ANSWER*: No, this will not result in a crash. It will instead, set the value 99 at the array index of 10, causing empty slots for every index between 2 and 10. 

- What will this output?

console.log(a[6])

*ANSWER*: Undefined

=========================================================================

31. What is the value of typeof undefined == typeof NULL?

*ANSWER*: The expression will be evaluated to true, since NULL will be treated as any other undefined variable

=========================================================================

32. What would following code return?

console.log(typeof typeof 1);

*ANSWER*: string

typeof 1 will return "number" and typeof "number" will return string.

=========================================================================

33. What will be the output of the following code?

<script>
  for (var i = 0; i < 5; i++) {
	setTimeout(function() { console.log(i); }, i * 1000 );
}
</script>

*ANSWER*: 5, 5, 5, 5, 5  due to hoisting of var.

The reason for this is that each function executed within the loop will be executed after the entire loop has completed and all will therefore reference the last value stored in i, which was 5.

=========================================================================

34. What is NaN? What is its type? How can you reliably test if a value is equal to NaN?

*ANSWER*: NaN represents a value that is "not a number". This special value results from an operation that could not be performed either because one of the operands was non-numeric (e.g., "abc" / 4), or because the result of the operation is non-numeric.

- For one thing, although NaN means “not a number”, its type is, believe it or not, Number.

- Additionally, NaN compared to anything – even itself! – is false:
- A semi-reliable way to test whether a number is equal to NaN is with the built-in function isNaN(), but even using isNaN() is an imperfect solution.
- A better solution would either be to use value !== value, which would only produce true if the value is equal to NaN. Also, ES6 offers a new Number.isNaN() function, which is a different and more reliable than the old global isNaN() function.

=========================================================================

35. What will the following code output and why?

<script>
var b = 1;
function outer(){
   	var b = 2
    function inner(){
        b++;
        var b = 3;
        console.log(b)
    }
    inner();
}
outer();
</script>

*ANSWER*: 3

There are three closures in the example, each with it’s own var b declaration. When a variable is invoked closures will be checked in order from local to global until an instance is found. Since the inner closure has a b variable of its own, that is what will be output.

=========================================================================

36. Discuss possible ways to write a function isInteger(x) that determines if x is an integer.

*ANSWER*: This may sound trivial and, in fact, it is trivial with ECMAscript 6 which introduces a new Number.isInteger() function for precisely this purpose. However, prior to ECMAScript 6, this is a bit more complicated, since no equivalent of the Number.isInteger() method is provided.

The issue is that, in the ECMAScript specification, integers only exist conceptually; i.e., numeric values are always stored as floating point values.

With that in mind, the simplest and cleanest pre-ECMAScript-6 solution (which is also sufficiently robust to return false even if a non-numeric value such as a string or null is passed to the function) would be the following use of the bitwise XOR operator:

function isInteger(x) { return (x ^ 0) === x; } 

The following solution would also work, although not as elegant as the one above:

function isInteger(x) { return (typeof x === 'number') && (x % 1 === 0); }

=========================================================================

37. How do you clone an object?

*ANSWER*: 
var obj = {a: 1 ,b: 2}
var objclone = Object.assign({},obj);

Now the value of objclone is {a: 1 ,b: 2} but points to a different object than obj.

Note the potential pitfall, though: Object.assign() will just do a shallow copy, not a deep copy. This means that nested objects aren’t copied. They still refer to the same nested objects as the original:

let obj = {
    a: 1,
    b: 2,
    c: {
        age: 30
    }
};

var objclone = Object.assign({},obj);
console.log('objclone: ', objclone);

obj.c.age = 45;
console.log('After Change - obj: ', obj);           // 45 - This also changes
console.log('After Change - objclone: ', objclone); // 45

**WITH Object.assign(), any overlapping properties are overwritten**