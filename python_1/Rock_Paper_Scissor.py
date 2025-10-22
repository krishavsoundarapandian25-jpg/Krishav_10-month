# Rock, Paper, Scissors Game
# This program allows a user to play Rock, paper, scissor against the computer.
# First Player to reach 4 wins is the overall winner. 


import random # random is a python library which helps to generate random numbers


# Initialize scores  
user_score = 0
computer_score = 0


# list of valid options 
options = ['rock', 'paper', 'scissor']

print("🎮 Welcome to the Rock, Paper, Scissors game!")
print("First to reach 4 wins beats the bot!\n")


# Main Game Loop 
while user_score < 4 and computer_score < 4: 
    user_choice = input("Enter your choice (rock, paper, scissor): ").lower()

# Validate user input
    if user_choice not in options:
        print("❌ Invalid choice! Please choose from rock, paper, or scissor.\n")
        continue


# Computer's random choice 
    computer_choice = random.choice(options)
    print(f"🤖 Computer chose: {computer_choice}")


# Check for Tie 
    if user_choice == computer_choice: 
        print("😐 It's a tie! Replay the round.\n")
        continue

      # Win conditions
    if (user_choice == "rock" and computer_choice == "scissor") or \
       (user_choice == "paper" and computer_choice == "rock") or \
       (user_choice == "scissor" and computer_choice == "paper"):
        print("✅ You win this round!\n")
    user_score += 1 
else:
        print("💀 Computer wins this round!\n")
        computer_score += 1
        
        print(f"📊 Score: You {user_score} - Bot {computer_score}\n")
 
 # Final result
if user_score == 4:
    print("🎉 Congratulations! You defeated the bot and won the game!")
else:
     print("🤖 The bot has won the game! Better luck next time.")