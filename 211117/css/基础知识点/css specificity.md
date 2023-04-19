

# CSS Inline style, Internal style 和 External Style





### [!important](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#!important)

There is a special piece of CSS that you can use to overrule all of the above calculations. However, you should be very careful with using it — `!important`. This is used to make a particular property and value the most specific thing, thus overriding the normal rules of the cascade.

Take a look at this example where we have two paragraphs, one of which has an ID.

The amount of specificity a selector has is measured using four different values (or components), which can be thought of as thousands, hundreds, tens, and ones — four single digits in four columns:

Thousands: Score one in this column if the declaration is inside a style attribute, aka inline styles. Such declarations don't have selectors, so their specificity is always 1000.
Hundreds: Score one in this column for each ID selector contained inside the overall selector.
Tens: Score one in this column for each class selector, attribute selector, or pseudo-class contained inside the overall selector.
Ones: Score one in this column for each element selector or pseudo-element contained inside the overall selector.
Note: The universal selector (*), combinators (+, >, ~, ' '), and negation pseudo-class (:not) have no effect on specificity.

