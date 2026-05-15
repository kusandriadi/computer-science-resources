# Module 08: Fun Activities — Unplugged Games and Puzzles

## No Computer Needed!

This module is packed with fun activities, games, and puzzles that teach Computational Thinking — all WITHOUT a computer! These activities work great in classrooms, at home, or with friends.

Each activity lists:
- **What you need** (materials)
- **How many players**
- **CT skills practiced**
- **Step-by-step instructions**

Let's play!

---

## Activity 1: Human Sorting Network

**What you need:** 6 or more players, tape or chalk to mark the floor, numbered cards

**CT Skills:** Algorithm Design, Decomposition

**Time:** 15-20 minutes

### What Is a Sorting Network?

A sorting network is a set of paths on the ground with "compare" stations. Two people walk along paths, and when they meet at a station, they compare their numbers. The person with the SMALLER number always goes left, and the person with the BIGGER number always goes right.

By the end, everyone is sorted in order — without anyone needing to see the big picture!

### Setup

1. Mark a network on the floor using tape or chalk. Here's a simple one for 4 people:

```
Start:    A ----.    .---- B
               |    |
              [COMPARE]
               |    |
          .----'    '----.
          |               |
     C ----.    .---- D   |
           |    |         |
          [COMPARE]       |
           |    |         |
      .----'    '----.    |
      |               |   |
      |          .-----.----.
      |          |         |
     [COMPARE]  [COMPARE]
      |    |     |    |
      '----'     '----'
End:   1    2    3    4
```

(For a simpler version, just have pairs of students compare and swap. Do this in rounds until everyone is sorted.)

2. Give each player a card with a random number.

### How to Play

1. Players stand at the start positions.
2. They walk forward along the paths.
3. When two players meet at a Compare station, they show each other their numbers.
4. The player with the **smaller** number takes the **left** path.
5. The player with the **bigger** number takes the **right** path.
6. Players continue walking until they reach the end.
7. Check: are the numbers in order from smallest to biggest? They should be!

### Why This Is Cool

Nobody decided the final order. Nobody could see everyone's numbers. The simple rule "smaller goes left, bigger goes right" at each station was enough to sort everyone. That's how computers sort things!

---

## Activity 2: Binary Number Bracelets

**What you need:** Beads (2 colors, like black and white), string or yarn, scissors

**CT Skills:** Pattern Recognition, Abstraction

**Time:** 20-30 minutes

### What Are Binary Numbers?

Computers use only two digits: **0** and **1**. This is called **binary**. Every number, letter, picture, and video on a computer is stored using just 0s and 1s!

Let's turn your age (or any number) into binary and make a bracelet out of it.

### How Binary Works

In binary, each position represents a power of 2:

| Position | 5th | 4th | 3rd | 2nd | 1st |
|----------|-----|-----|-----|-----|-----|
| Value    | 16  | 8   | 4   | 2   | 1   |

To write a number in binary, figure out which values add up to your number.

**Example: The number 10**
- 16? NO (too big). Write **0**.
- 8? YES (10 - 8 = 2 left). Write **1**.
- 4? NO (2 is less than 4). Write **0**.
- 2? YES (2 - 2 = 0 left). Write **1**.
- 1? NO (nothing left). Write **0**.

So 10 in binary = **01010**

**Example: The number 7**
- 16? NO. **0**
- 8? NO. **0**
- 4? YES (7 - 4 = 3). **1**
- 2? YES (3 - 2 = 1). **1**
- 1? YES (1 - 1 = 0). **1**

So 7 in binary = **00111**

### Making the Bracelet

1. Pick your number (your age is a great choice!).
2. Convert it to binary using the method above.
3. Choose two bead colors:
   - **White** = 0
   - **Black** = 1
4. Thread the beads onto string in the binary order.
5. Tie the bracelet and wear it!

**Example: Age 9 = 01001**
Beads: white, black, white, white, black

### Challenge

- Can you read your friend's binary bracelet and figure out their number?
- Make bracelets for your whole family!

---

## Activity 3: Pixel Art (Grid Coloring)

**What you need:** Graph paper (or draw your own grid), colored pencils or markers

**CT Skills:** Abstraction, Pattern Recognition, Decomposition

**Time:** 15-25 minutes

### What Are Pixels?

Every picture on a screen is made of tiny squares called **pixels**. If you zoom in really close on any digital picture, you'll see them — little colored squares! Pixel art is like painting, but using a grid of squares instead of brushstrokes.

### How to Create Pixel Art

1. Draw a grid on your paper (10x10 squares is a good start, or use graph paper).
2. Plan a simple picture: a heart, a star, a smiley face, a tree, a spaceship, an animal.
3. Color in the squares to create your picture.

### Encoding Your Art

Here's the cool part: you can write your picture as **numbers** instead of colors!

**How to encode:**

For each row, write down how many squares of each color there are, from left to right.

**Example: A row that looks like this:**
White White White Black Black Black White White White White

You'd write: **3W, 3B, 4W** (3 white, 3 black, 4 white)

**Do this for every row, and you've turned a picture into data!**

### The Decoding Challenge

1. Player 1 creates a pixel art picture and encodes it as numbers.
2. Player 1 gives ONLY the numbers to Player 2.
3. Player 2 decodes the numbers back into a picture by coloring a grid.
4. Compare the pictures — do they match?

**Example to decode:**

Grid: 8 columns wide

```
Row 1: 3W, 2B, 3W
Row 2: 2W, 4B, 2W
Row 3: 1W, 6B, 1W
Row 4: 8B
Row 5: 8B
Row 6: 1W, 6B, 1W
Row 7: 2W, 4B, 2W
Row 8: 3W, 2B, 3W
```

What shape does this make? (Hint: it's a diamond!)

---

## Activity 4: Treasure Hunt with Algorithms

**What you need:** Small "treasure" (a toy, candy, sticker), paper, pencil, an area to hide the treasure

**CT Skills:** Algorithm Design, Logical Thinking, Debugging

**Time:** 20-30 minutes

### Setup

1. One player (the Hider) hides a treasure somewhere in the room, house, or yard.
2. The Hider writes an **algorithm** (step-by-step directions) to find the treasure.
3. Another player (the Seeker) follows the algorithm to find the treasure.

### Rules for Writing the Algorithm

The directions must be very specific:
- Use exact numbers: "Take 5 steps forward" (not "walk a bit").
- Use clear directions: "Turn left" or "Turn right" (not "turn that way").
- Include landmarks: "Walk to the big tree" or "Stop at the red chair."

### Example Algorithm

```
Step 1: Start at the front door.
Step 2: Take 10 steps forward.
Step 3: Turn right.
Step 4: Walk until you reach the blue bookshelf.
Step 5: Look on the third shelf from the bottom.
Step 6: The treasure is behind the big red book!
```

### Make It Harder

- Add **IF-THEN** branches: "IF you see a yellow sticky note, THEN turn left. ELSE turn right."
- Add **puzzles** at each step: "Solve this math problem to find out how many steps to take next: 3 + 4 = ?"
- Create a **multi-step** treasure hunt where each clue leads to the next clue.

### Debugging the Hunt

If the Seeker can't find the treasure, debug together:
- Which step was confusing?
- Did the Seeker miss a turn?
- Was a direction wrong?

---

## Activity 5: Error Detection Magic Trick (Parity)

**What you need:** 36 cards or pieces of paper (two colors — like blue and yellow), a flat surface

**CT Skills:** Pattern Recognition, Logical Thinking, Debugging

**Time:** 15-20 minutes

### The Magic Trick

This trick amazes people because you can tell which card someone flipped — without looking!

### Setup

1. Lay out a 5x5 grid of cards, randomly showing blue or yellow faces.
2. HERE'S THE SECRET: Add a 6th row and a 6th column. In each extra position, place a card so that EVERY row and EVERY column has an **even** number of one color (let's say yellow). This is called **parity**.

### How to Perform the Trick

1. Show your audience the 6x6 grid. (They think it's random, but you set it up carefully!)
2. Ask someone to flip ONE card while you look away.
3. Turn back and look at the grid.
4. Check each row: count the yellow cards. If a row has an ODD number of yellow cards, that row has the flipped card.
5. Check each column: count the yellow cards. If a column has an ODD number of yellow cards, that column has the flipped card.
6. The flipped card is where the "odd" row meets the "odd" column!

### Why This Works

You set up the grid so every row and column has an even number of yellow cards. When someone flips a card, it changes one row from even to odd and one column from even to odd. Those two tell you EXACTLY which card was flipped!

### The CT Connection

This is how computers detect errors! When data is sent over the internet, extra "parity bits" (like your extra row and column) are added. If a bit gets flipped during transfer, the computer can detect it — just like your magic trick!

---

## Activity 6: The Cup Stacking Algorithm Challenge

**What you need:** 6-10 plastic cups (or paper cups), a table

**CT Skills:** Algorithm Design, Decomposition, Debugging

**Time:** 10-15 minutes

### How to Play

1. Build a cup pyramid: 4 cups on the bottom, 3 on the next level, 2 on the next, and 1 on top.
2. Now write an algorithm (step-by-step instructions) for someone else to build the same pyramid.
3. Knock down the pyramid.
4. Give your algorithm to a partner. Can they rebuild the pyramid using ONLY your instructions?

### Rules

- Your partner can ONLY do what the instructions say.
- You cannot talk, gesture, or help in any way.
- If the instructions are unclear, the partner does their best guess (which might be wrong!).

### What You'll Learn

You'll discover how hard it is to write clear instructions! You might say "put a cup down" — but WHERE? Which direction? This teaches you to be very precise in your algorithms.

---

## Activity 7: The Telephone Algorithm

**What you need:** 5 or more players, paper, pencils

**CT Skills:** Algorithm Design, Debugging, Abstraction

**Time:** 15-20 minutes

### How to Play

1. Player 1 writes an algorithm for a simple task (like drawing a smiley face, tying a shoe, or making a paper hat). The algorithm should have 6-8 steps.

2. Player 1 whispers Step 1 to Player 2. Player 2 writes it down.
   Player 1 whispers Step 2 to Player 2. Player 2 writes it down.
   Continue until all steps are passed.

3. Player 2 now reads their version to Player 3 (without showing it), and Player 3 writes it down.

4. Continue until the algorithm reaches the last player.

5. The last player tries to follow the algorithm.

6. Compare the ORIGINAL algorithm with the FINAL version. How much changed?

### Discussion

- What "bugs" crept in?
- Which steps changed the most?
- How could you make the algorithm more resistant to errors?
- This is like the children's game "Telephone" — but with instructions!

---

## Activity 8: Human Robot Maze

**What you need:** Chairs or boxes to create a maze, 2+ players, a blindfold (optional)

**CT Skills:** Algorithm Design, Logical Thinking, Debugging

**Time:** 20-30 minutes

### Setup

1. Arrange chairs, boxes, or cushions to create a simple maze in a room or hallway.
2. Place a "goal" (a stuffed animal, book, or ball) at the end of the maze.

### How to Play

1. One player is the **Robot**. The Robot stands at the start of the maze and closes their eyes (or wears a blindfold).
2. Another player is the **Programmer**. The Programmer can see the maze and gives verbal commands.
3. The Robot can only follow these commands:
   - "Forward" (one step forward)
   - "Left" (turn left 90 degrees)
   - "Right" (turn right 90 degrees)
   - "Stop" (stand still)
   - "Grab" (pick up the goal object)

4. The Programmer guides the Robot through the maze to the goal.

### Advanced Version

The Programmer must write ALL instructions on paper FIRST, then hand them to the Robot. No changes allowed! This forces the Programmer to plan the entire path in advance.

### Debugging

If the Robot bumps into something:
- What instruction was wrong?
- Was it a missing step, wrong direction, or wrong number of steps?
- How would you fix the algorithm?

---

## Activity 9: Pattern Bead Strings

**What you need:** Beads or colored pasta (3-4 colors), string

**CT Skills:** Pattern Recognition, Algorithm Design

**Time:** 15-20 minutes

### How to Play

1. Create a pattern using beads on a string. Start simple and get harder:
   - **Easy:** Red, Blue, Red, Blue, Red, Blue (AB pattern)
   - **Medium:** Red, Red, Blue, Green, Red, Red, Blue, Green (AABC pattern)
   - **Hard:** Red, Blue, Blue, Red, Blue, Blue, Blue, Red, Blue, Blue, Blue, Blue (the number of blues increases: 2, 3, 4!)

2. Show your string to a friend. Can they figure out the pattern?

3. Your friend continues the string by adding the right beads.

4. Now your friend creates a pattern for YOU to figure out!

### Write the Algorithm

After you figure out the pattern, write it as an algorithm:

**Example:**
```
REPEAT forever:
  Add 1 red bead
  Add 2 blue beads
```

This produces: R, B, B, R, B, B, R, B, B...

Can you write algorithms for more complex patterns?

---

## Activity 10: Sandwich Assembly Line

**What you need:** Bread, spreads, fillings (or pretend ingredients using paper cutouts), 4+ players

**CT Skills:** Decomposition, Algorithm Design, Pattern Recognition

**Time:** 15-20 minutes

### How to Play

1. **Decompose** the sandwich-making process into separate steps:
   - Station 1: Get bread
   - Station 2: Spread peanut butter
   - Station 3: Add jelly
   - Station 4: Put slices together and cut

2. Each player stands at ONE station and does ONLY their step.

3. Pass the sandwich from station to station.

4. See how many sandwiches your assembly line can make in 3 minutes!

### Discussion

- What patterns did you notice? (Each sandwich follows the same steps!)
- What happens if one station is too slow? (A bottleneck!)
- How could you make the assembly line faster? (Add a second person to the slow station!)
- What if someone at a station makes a mistake? How do you debug?

If you don't want to use real food, cut paper into "bread slices" and use colored paper for "ingredients."

---

## Activity 11: Story Algorithm Cards

**What you need:** Index cards or paper cut into cards, pencils, 2+ players

**CT Skills:** Algorithm Design, Decomposition, Logical Thinking

**Time:** 15-20 minutes

### How to Play

1. Think of a short story (a fairy tale works great, like Goldilocks or Little Red Riding Hood).

2. Write each EVENT of the story on a separate card. One event per card. Write at least 8 cards.

**Example for "Goldilocks and the Three Bears":**
- The three bears go for a walk.
- Goldilocks finds the bears' house.
- Goldilocks tries three bowls of porridge.
- Goldilocks tries three chairs.
- The small chair breaks.
- Goldilocks tries three beds.
- Goldilocks falls asleep in the small bed.
- The bears come home.
- The bears find Goldilocks.
- Goldilocks runs away.

3. Shuffle the cards and give them to a friend.

4. Your friend must put the cards in the CORRECT order to retell the story.

5. Check: is the order right? If not, debug! Which cards are out of place?

### Make It Harder

- Add 2-3 FAKE events that don't belong in the story. Your friend must find and remove them!
- Mix cards from TWO different stories. Your friend must separate them and order each one.

---

## Activity 12: The Debugging Relay Race

**What you need:** 2 teams of 3-4 players, paper, pencils, a list of "buggy" instructions

**CT Skills:** Debugging, Algorithm Design

**Time:** 15-20 minutes

### Setup

Prepare 5 sets of "buggy instructions" (instructions with mistakes). Write each set on a separate piece of paper.

**Example buggy instruction sets:**

**Set 1: Making toast**
1. Put butter on the bread. 2. Put bread in toaster. 3. Wait for toast. 4. Get bread.
(Bug: wrong order)

**Set 2: Washing hands**
1. Turn on water. 2. Put soap on hands. 3. Dry hands. 4. Turn off water.
(Bug: missing step — scrub hands!)

**Set 3: Going to bed**
1. Brush teeth. 2. Get in bed. 3. Turn off light. 4. Put on pajamas. 5. Fall asleep.
(Bug: pajamas should come before getting in bed)

**Set 4: Sending a letter**
1. Write the letter. 2. Mail the letter. 3. Put letter in envelope. 4. Put stamp on envelope. 5. Write the address.
(Bug: several steps are out of order)

**Set 5: Making lemonade**
1. Get a glass. 2. Add 10 cups of sugar. 3. Add water. 4. Add lemon juice. 5. Stir.
(Bug: way too much sugar — should be 2 tablespoons)

### How to Play

1. Place each buggy instruction set at a different spot around the room (stations).
2. Teams line up at the starting point.
3. When you say "Go!", one player from each team runs to Station 1.
4. They read the buggy instructions, find the bug, and write the fix.
5. They run back and tag the next teammate.
6. The next teammate runs to Station 2.
7. Continue until all 5 stations are done.
8. Check answers. The team with the most correct fixes AND fastest time wins!

---

## Activity 13: Secret Code Messages

**What you need:** Paper, pencils, the code key below

**CT Skills:** Pattern Recognition, Abstraction, Algorithm Design

**Time:** 15-20 minutes

### The Caesar Cipher

A cipher is a way to encode a secret message. The Caesar Cipher is one of the oldest and simplest. Here's how it works:

Shift every letter forward by a set number. Let's use a shift of 3:

```
Plain:  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
Cipher: D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
```

So A becomes D, B becomes E, C becomes F, and so on. X wraps around to A, Y to B, Z to C.

### Encoding a Message

**Message:** HELLO
- H becomes K
- E becomes H
- L becomes O
- L becomes O
- O becomes R

**Encoded message:** KHOOR

### Decoding a Message

To decode, shift each letter BACK by 3.

**Try decoding these messages (shift of 3):**
1. FRPSXWHU (answer: COMPUTER)
2. SDWWHUQ (answer: PATTERN)
3. DOJRULWKP (answer: ALGORITHM)

### Make Your Own

1. Write a secret message.
2. Encode it using the Caesar Cipher (pick your own shift number!).
3. Give the encoded message AND the shift number to a friend.
4. Can they decode it?

### Challenge

What if you get an encoded message but DON'T know the shift number? Try every possible shift (1 through 25) until one makes sense. That's called **brute force** — trying every possibility!

---

## Activity 14: Sorting Without Seeing

**What you need:** 5-8 players, numbered cards (one per player, numbers hidden from others)

**CT Skills:** Algorithm Design, Logical Thinking, Decomposition

**Time:** 10-15 minutes

### How to Play

1. Give each player a card with a number. Players can see ONLY their own number.
2. The goal: line up in order from smallest to biggest.
3. The rule: Players can only ask ONE question to another player: "Is your number bigger than mine?"
4. The other player answers YES or NO.
5. Based on the answer, players swap positions or stay put.
6. Repeat until everyone is in order.

### Discussion

- How many questions did it take?
- What strategy worked best?
- Is there a pattern to the questions you should ask?
- This is how computers sort data — by comparing two items at a time!

---

## Activity 15: Build-a-Bot Drawing Game

**What you need:** Paper, pencils, 2 players who cannot see each other's paper

**CT Skills:** Algorithm Design, Abstraction, Debugging

**Time:** 15-20 minutes

### How to Play

1. Player 1 draws a simple robot on their paper (using basic shapes — circles, squares, rectangles, triangles).

2. Player 1 then writes an algorithm describing how to draw the robot, step by step.

**Example:**
```
Step 1: Draw a large square in the middle of the paper. This is the body.
Step 2: Draw a smaller square on top of the body. This is the head.
Step 3: Draw two small circles inside the head for eyes.
Step 4: Draw a straight line across the head below the eyes for the mouth.
Step 5: Draw two long rectangles coming down from the bottom of the body for legs.
Step 6: Draw two thin rectangles coming out from the sides of the body for arms.
Step 7: Draw a small triangle on top of the head for an antenna.
```

3. Player 1 gives ONLY the written algorithm to Player 2 (not the drawing!).

4. Player 2 follows the algorithm and draws the robot.

5. Compare the two drawings. Do they match?

### Debugging

If the drawings don't match:
- Which steps were unclear?
- What was missing?
- How could the algorithm be improved?

---

## Bonus Activity: Create Your Own CT Game!

Now it's YOUR turn. Use what you've learned to create your own game that teaches one or more CT skills.

**Your game should have:**
1. A clear name
2. What you need to play
3. How many players
4. Clear rules (an algorithm for playing!)
5. How to win
6. Which CT skill(s) it teaches

**Ideas to get you started:**
- A board game where you navigate a maze by writing algorithms
- A card game where you find patterns to score points
- A guessing game that uses logical thinking
- A team game where you debug broken instructions

Write up your game, test it with friends, and debug it until it works perfectly!

---

## Activity Quick-Reference Table

| # | Activity | Players | Time | Main CT Skills |
|---|----------|---------|------|---------------|
| 1 | Human Sorting Network | 6+ | 15-20 min | Algorithm Design, Decomposition |
| 2 | Binary Number Bracelets | 1+ | 20-30 min | Pattern Recognition, Abstraction |
| 3 | Pixel Art | 1+ | 15-25 min | Abstraction, Pattern Recognition |
| 4 | Treasure Hunt with Algorithms | 2+ | 20-30 min | Algorithm Design, Logical Thinking |
| 5 | Error Detection Magic Trick | 2+ | 15-20 min | Pattern Recognition, Debugging |
| 6 | Cup Stacking Algorithm | 2+ | 10-15 min | Algorithm Design, Debugging |
| 7 | Telephone Algorithm | 5+ | 15-20 min | Algorithm Design, Debugging |
| 8 | Human Robot Maze | 2+ | 20-30 min | Algorithm Design, Logical Thinking |
| 9 | Pattern Bead Strings | 2+ | 15-20 min | Pattern Recognition, Algorithm Design |
| 10 | Sandwich Assembly Line | 4+ | 15-20 min | Decomposition, Algorithm Design |
| 11 | Story Algorithm Cards | 2+ | 15-20 min | Algorithm Design, Decomposition |
| 12 | Debugging Relay Race | 6+ | 15-20 min | Debugging, Algorithm Design |
| 13 | Secret Code Messages | 2+ | 15-20 min | Pattern Recognition, Algorithm Design |
| 14 | Sorting Without Seeing | 5+ | 10-15 min | Algorithm Design, Logical Thinking |
| 15 | Build-a-Bot Drawing | 2 | 15-20 min | Algorithm Design, Abstraction |

---

Have fun with these activities! The more you play, the stronger your Computational Thinking skills become. And remember — the best part about these games is that you're learning to think like a problem-solver while having a great time!

---

[Previous: Module 07 — Everyday CT](07-everyday-ct.md) | [Next: Module 09 — For Teachers and Parents](09-for-teachers-and-parents.md)
