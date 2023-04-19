
{
    console.log(typeof x);//undefined
}

{
    var x
    console.log(typeof x);//undefined
}

{
    console.log(typeof x);//undefined
    var x
}

{
    let x
    console.log(typeof x);//undefined
}

{
    console.log(typeof x);//Cannot access 'x' before initialization
    let x
}

