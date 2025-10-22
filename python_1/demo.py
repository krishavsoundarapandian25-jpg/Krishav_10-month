import random
import tkinter as tk
from tkinter import messagebox

# Initialize scores
user_score = 0
computer_score = 0

# List of valid options
options = ['rock', 'paper', 'scissor']

# Function to play a round
def play(user_choice):
    global user_score, computer_score

    computer_choice = random.choice(options)
    result_text.set(f"🤖 Computer chose: {computer_choice}")

    if user_choice == computer_choice:
        messagebox.showinfo("Result", "😐 It's a tie! Replay the round.")
        return

    if (user_choice == "rock" and computer_choice == "scissor") or \
       (user_choice == "paper" and computer_choice == "rock") or \
       (user_choice == "scissor" and computer_choice == "paper"):
        user_score += 1
        messagebox.showinfo("Result", "✅ You win this round!")
    else:
        computer_score += 1
        messagebox.showinfo("Result", "💀 Computer wins this round!")

    score_text.set(f"📊 Score: You {user_score} - Bot {computer_score}")

    # Check for game over
    if user_score == 4:
        messagebox.showinfo("Game Over", "🎉 Congratulations! You defeated the bot!")
        root.destroy()
    elif computer_score == 4:
        messagebox.showinfo("Game Over", "🤖 The bot has won the game! Better luck next time.")
        root.destroy()

# Set up GUI
root = tk.Tk()
root.title("Rock, Paper, Scissors")
root.geometry("400x300")

tk.Label(root, text="🎮 Rock, Paper, Scissors Game", font=("Arial", 16)).pack(pady=10)
tk.Label(root, text="First to reach 4 wins beats the bot!", font=("Arial", 12)).pack(pady=5)

# Buttons for user choices
frame = tk.Frame(root)
frame.pack(pady=20)

tk.Button(frame, text="Rock 🪨", width=10, command=lambda: play("rock")).grid(row=0, column=0, padx=5)
tk.Button(frame, text="Paper 📄", width=10, command=lambda: play("paper")).grid(row=0, column=1, padx=5)
tk.Button(frame, text="Scissor ✂️", width=10, command=lambda: play("scissor")).grid(row=0, column=2, padx=5)

# Labels to show results and score
result_text = tk.StringVar()
score_text = tk.StringVar()
tk.Label(root, textvariable=result_text, font=("Arial", 12)).pack(pady=10)
tk.Label(root, textvariable=score_text, font=("Arial", 12)).pack(pady=10)

score_text.set(f"📊 Score: You {user_score} - Bot {computer_score}")

# Run GUI loop
root.mainloop()
