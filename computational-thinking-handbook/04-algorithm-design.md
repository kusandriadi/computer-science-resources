# Module 04: Algorithm Design — Creating Step-by-Step Instructions

## What is an Algorithm?

Here's a fun word: **algorithm** (say it: AL-go-rith-um).

It sounds fancy, but it's actually something very simple:

> **An algorithm = a set of step-by-step instructions to solve a problem or complete a task.**

You follow algorithms every day! A recipe is an algorithm for cooking. Directions to a friend's house are an algorithm for getting there. The rules of a game are an algorithm for playing it.

The key things about an algorithm:
1. It has **clear steps**.
2. The steps are in a **specific order**.
3. Anyone who follows the steps gets the **same result**.

That's it! If you can write clear steps in the right order, you can design an algorithm.

---

## Why Algorithm Design Matters

Think about it — what would happen if a recipe had no steps? You'd just have a pile of ingredients and no idea what to do with them.

What if directions to school had no order? "Turn left. Walk two blocks. Turn right. Go out the door." Wait — shouldn't "go out the door" come FIRST?

Algorithms matter because:

1. **They make sure nothing is forgotten.** Every step is written down.
2. **They keep things in order.** You do the right thing at the right time.
3. **Anyone can follow them.** You don't need to be an expert — just follow the steps!
4. **They can be repeated.** Every time you follow the same algorithm, you get the same result.

---

## Real-Life Examples

### Example 1: Recipe for Making a Sandwich

Here's an algorithm for making a peanut butter and jelly sandwich:

```
Step 1: Get two slices of bread.
Step 2: Get the peanut butter jar and jelly jar.
Step 3: Get a knife.
Step 4: Open the peanut butter jar.
Step 5: Use the knife to scoop peanut butter.
Step 6: Spread peanut butter on one slice of bread.
Step 7: Open the jelly jar.
Step 8: Use the knife to scoop jelly.
Step 9: Spread jelly on the other slice of bread.
Step 10: Put the two slices together (peanut butter side facing jelly side).
Step 11: Cut the sandwich in half if you want.
Step 12: Eat and enjoy!
```

If anyone follows these steps, they'll end up with a PB&J sandwich. That's an algorithm!

### Example 2: Getting from Home to School

```
Step 1: Walk out the front door.
Step 2: Turn right on the sidewalk.
Step 3: Walk straight for three blocks.
Step 4: Turn left at the traffic light.
Step 5: Walk past the bakery and the bookstore.
Step 6: Cross the street at the crosswalk.
Step 7: The school is the big building on your right.
Step 8: Walk through the school gate.
```

### Example 3: Rules of a Simple Game (Tag)

```
Step 1: Choose one person to be "it."
Step 2: Everyone else runs away.
Step 3: The person who is "it" chases the others.
Step 4: If "it" touches someone, that person becomes "it."
Step 5: The new "it" counts to 5 while others run away.
Step 6: Repeat from Step 3 until everyone is tired!
```

---

## Ingredients of a Good Algorithm

Not all algorithms are created equal. Here's what makes one GOOD:

### 1. Clear Steps

Each step should be so clear that anyone can understand it — even someone who has never done the task before.

**Bad step:** "Make the food."
**Good step:** "Put two tablespoons of rice into the pot and add water until the water is one finger above the rice."

### 2. Correct Order

The steps need to be in the right order. You can't eat the cake before you bake it!

### 3. Nothing Missing

If you skip a step, the algorithm won't work. Imagine a hand-washing algorithm that skips "use soap" — your hands wouldn't really be clean!

### 4. A Clear Start and End

Every algorithm should have a starting point and an ending point. You should know when you're done!

---

## Algorithms with Decisions

Now here's where it gets cool. Some algorithms have decision points — places where you have to make a choice. We use **IF-THEN** for these.

**Example: Getting dressed in the morning**

```
Step 1: Check the weather.
Step 2: IF it's sunny, THEN wear a t-shirt and shorts.
         IF it's rainy, THEN wear a jacket and bring an umbrella.
         IF it's cold, THEN wear a sweater and long pants.
Step 3: Put on socks.
Step 4: Put on shoes.
Step 5: IF going to school, THEN put on school uniform instead.
Step 6: Look in the mirror. Done!
```

The IF-THEN parts are like a fork in the road — you go one way or another depending on what's true.

**Another example: Playing outside**

```
Step 1: Go outside.
Step 2: IF your friend is there, THEN play together.
         IF your friend is not there, THEN play by yourself.
Step 3: IF you get thirsty, THEN go inside and drink water.
Step 4: IF it starts raining, THEN go inside.
Step 5: IF it's time for dinner, THEN go home.
```

---

## Algorithms with Repeating (Loops)

Sometimes an algorithm needs to repeat a step over and over. We call this a **loop**.

**Example: Eating a bowl of cereal**

```
Step 1: Pour cereal in a bowl.
Step 2: Pour milk on the cereal.
Step 3: Pick up your spoon.
Step 4: REPEAT the following UNTIL the bowl is empty:
           - Scoop cereal with the spoon.
           - Put the spoon in your mouth.
           - Chew and swallow.
Step 5: Drink the leftover milk if you want.
Step 6: Put the bowl in the sink.
```

Step 4 is a loop! You keep scooping, eating, and chewing until there's no more cereal. You don't need to write "take bite 1, take bite 2, take bite 3..." — you just say "repeat until done."

**Another example: Looking for a lost toy**

```
Step 1: Think about the last place you saw the toy.
Step 2: Go to that place and look.
Step 3: IF you found the toy, THEN celebrate! You're done!
Step 4: IF you didn't find the toy:
           - Think of another place to check.
           - Go there and look.
           - REPEAT Step 3 and Step 4 UNTIL you find it (or run out of places).
```

---

## Activity 1: Write Instructions for Brushing Your Teeth

**What you need:** Paper and pencil.

**Your mission:** Write an algorithm for brushing your teeth. Be VERY specific! Imagine you're writing instructions for someone who has NEVER brushed their teeth before.

**Rules:**
- Each step must be ONE small action.
- Steps must be in the right order.
- Don't skip any step, no matter how small it seems.

**Start:** What's the very first thing you do? (Hint: it's probably "walk to the bathroom" or "pick up your toothbrush")

**End:** What's the very last thing you do?

**Check your work:** Read your algorithm to a friend or family member. Ask them to follow it EXACTLY. Did they end up with clean teeth? Or did you forget a step?

**Think about:** Did you remember to include:
- Getting the toothbrush?
- Opening the toothpaste?
- Wetting the brush?
- Brushing ALL the teeth (top, bottom, front, back)?
- Spitting?
- Rinsing?
- Putting things away?

---

## Activity 2: Teach an Alien to Make a Paper Airplane

**What you need:** Paper, pencil, and a few sheets of paper for folding.

**The story:** An alien has just landed on Earth. The alien is very smart, but it has never seen paper before. It can follow instructions perfectly, but it has NO background knowledge about paper, folding, or airplanes.

**Your mission:** Write an algorithm that teaches the alien how to make a paper airplane. Remember — the alien will follow your instructions EXACTLY. If you say "fold the paper," the alien might fold it in any random way because you didn't say HOW to fold it!

**Tips:**
- Start with "pick up the piece of paper."
- Be specific about WHICH direction to fold.
- Say things like "fold the top edge down to meet the bottom edge."
- Tell the alien which way the paper should be facing.

**Test your algorithm:** Give your instructions to a friend (they pretend to be the alien). They should follow ONLY what you wrote — nothing more. Did they make a good airplane?

---

## Activity 3: The Robot Game

**What you need:** Two or more players, an open space (living room, backyard, classroom).

**How to play:**

1. **Set up:** Put a small object (like a book or toy) somewhere in the room. This is the "treasure."

2. **Choose roles:**
   - One person is the **Robot**. The Robot can only move by following instructions. It cannot think for itself.
   - One person is the **Programmer**. The Programmer gives instructions to the Robot.

3. **The commands the Robot understands:**
   - "Step forward" (take one step forward)
   - "Step backward" (take one step backward)
   - "Turn left" (turn 90 degrees to the left)
   - "Turn right" (turn 90 degrees to the right)
   - "Pick up" (pick up the object in front of you)
   - "Put down" (put down what you're holding)

4. **The goal:** The Programmer must guide the Robot to the treasure using ONLY these commands. The Robot does EXACTLY what it's told — no more, no less.

5. **Important rules:**
   - The Robot cannot talk or ask questions.
   - The Robot must follow commands literally (if you say "step forward" and there's a wall, the Robot bumps into the wall!).
   - The Programmer must think carefully before giving each command.

**Make it harder:**
- Add obstacles (chairs, pillows) the Robot must navigate around.
- Blindfold the Robot so they rely completely on the Programmer's instructions.
- Have the Programmer write ALL the commands on paper first, THEN the Robot follows them all at once (no changes allowed!).

**What you learn:** This game teaches you that algorithms need to be precise, complete, and in the right order!

---

## Activity 4: Algorithm for Your Favorite Activity

**What you need:** Paper and pencil.

**Instructions:**

1. Choose an activity you know well:
   - How to draw a star
   - How to make a friendship bracelet
   - How to do a cartwheel
   - How to play your favorite card game
   - How to make a paper boat

2. Write an algorithm (step-by-step instructions) for this activity.

3. Your algorithm should be good enough that someone who has NEVER done the activity could follow your steps and succeed.

4. Test it! Give your algorithm to someone and see if they can follow it.

---

## Activity 5: Fix the Mixed-Up Algorithm

**What you need:** Paper and pencil.

**Instructions:** The steps below are all mixed up! Put them in the correct order by numbering them 1 through 8.

**Mixed-Up Algorithm: Making a Bowl of Cereal**

___ Pour milk into the bowl.
___ Get a bowl from the cupboard.
___ Eat the cereal with the spoon.
___ Put the cereal box and milk back where they belong.
___ Get the cereal box and the milk from the kitchen.
___ Get a spoon from the drawer.
___ Pour cereal into the bowl.
___ Sit down at the table.

**Can you figure out the right order?**

---

## Algorithm vs. No Algorithm

Let's see what happens when you DON'T have a good algorithm.

**Scenario 1: Baking without a recipe**
"Just put some stuff in the oven!" Result: a burnt, flat, terrible-tasting blob. Yikes.

**Scenario 2: Giving bad directions**
"Go that way for a bit, then turn somewhere." Result: your friend is lost and calls you crying.

**Scenario 3: Playing a game with unclear rules**
"Just hit the ball!" Result: everyone argues about the rules and nobody has fun.

Now compare:

**Scenario 1 with algorithm:** Follow the recipe step by step. Result: delicious cookies!

**Scenario 2 with algorithm:** "Walk north for two blocks, turn left, it's the third house on the right." Result: your friend arrives right at your door!

**Scenario 3 with algorithm:** Clear rules that everyone agrees on. Result: fair game, everyone has fun!

---

## Pseudocode: Writing Algorithms in Plain English

When people who work with computers write algorithms, they sometimes use something called **pseudocode**. Don't worry — it's just a way of writing steps that looks a tiny bit like computer code but is really just plain English.

Here's pseudocode for deciding what to do after school:

```
START
  Check backpack for homework
  IF I have homework THEN
    Do homework first
    WHEN homework is done, go play
  ELSE
    Go play right away
  END IF
  IF it gets dark THEN
    Go home
  END IF
  Eat dinner
  Brush teeth
  Go to bed
END
```

See? It's just plain English with some structure. The words START and END tell you where the algorithm begins and finishes. IF-THEN helps you make decisions.

You don't need to use pseudocode — regular numbered steps work great too! This is just another way of writing the same thing.

---

## Quiz Time!

**Question 1:** What is an algorithm?
- A) A type of computer
- B) A set of step-by-step instructions to solve a problem
- C) A math formula
- D) A type of robot

**Question 2:** Which of these is the MOST important thing about an algorithm?
- A) It should be very long
- B) It should use big words
- C) The steps should be clear and in the right order
- D) It should be written on a computer

**Question 3:** What's wrong with this algorithm for making toast?

```
Step 1: Spread butter on the toast.
Step 2: Put bread in the toaster.
Step 3: Wait for the toast to pop up.
Step 4: Get a slice of bread.
```

- A) It's too long
- B) The steps are in the wrong order
- C) It uses too many steps
- D) Nothing is wrong

**Question 4:** In an algorithm, what does "REPEAT UNTIL" mean?
- A) Do something once
- B) Do something over and over until a condition is true
- C) Skip a step
- D) Go backward

**Question 5:** You're writing an algorithm to help a friend walk from the classroom to the library. Which set of instructions is BETTER?

Set A: "Go to the library."
Set B: "Turn left out of the classroom. Walk to the end of the hallway. Turn right. The library is the second door on the left."

- A) Set A, because it's shorter
- B) Set B, because it has clear, specific steps
- C) Both are equally good
- D) Neither is good

---

## Challenge: Design Your Own Game

Ready for a BIG challenge? **Design a simple game and write the algorithm for playing it!**

Your game algorithm should include:
1. **Setup:** What do you need? How many players?
2. **Rules:** What can players do? What can't they do?
3. **How to play:** Step-by-step instructions for a turn.
4. **How to win:** When is the game over? How do you decide the winner?

The game can be anything — a card game, a board game, a running game, a guessing game. Keep it simple but make the rules clear enough that anyone could play it by reading your algorithm.

**Test your game:** Teach it to friends or family using ONLY your written algorithm. Can they play it without you explaining anything extra?

---

## What You Learned

Amazing work! In this module, you learned that:
- An **algorithm** is a set of step-by-step instructions to solve a problem or complete a task.
- Good algorithms have clear steps, correct order, nothing missing, and a clear start and end.
- Algorithms can include **decisions** (IF-THEN) and **loops** (REPEAT UNTIL).
- You follow algorithms every day — recipes, directions, game rules.
- Writing good algorithms means being very specific and thinking about every little detail.

---

## Answers

**Question 1:** B) A set of step-by-step instructions to solve a problem.

**Question 2:** C) The steps should be clear and in the right order.

**Question 3:** B) The steps are in the wrong order. The correct order should be: Get a slice of bread, Put bread in the toaster, Wait for the toast to pop up, Spread butter on the toast.

**Question 4:** B) Do something over and over until a condition is true.

**Question 5:** B) Set B, because it has clear, specific steps.

**Fix the Mixed-Up Algorithm (Activity 5):**
1. Get the cereal box and the milk from the kitchen.
2. Get a bowl from the cupboard.
3. Get a spoon from the drawer.
4. Pour cereal into the bowl.
5. Pour milk into the bowl.
6. Sit down at the table.
7. Eat the cereal with the spoon.
8. Put the cereal box and milk back where they belong.

---

[Previous: Module 03 — Abstraction](03-abstraction.md) | [Next: Module 05 — Logical Thinking](05-logical-thinking.md)
