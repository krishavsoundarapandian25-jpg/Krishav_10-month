import random
import tkinter as tk
from tkinter import messagebox

# --- Game Variables ---
secret = random.randint(1, 100)
tries = 0


# --- Game Logic Functions ---
def check_guess(event=None):
    global tries

    # Get text from the input box
    user_input = entry_guess.get()

    # Make sure the user typed a valid number
    if not user_input.isdigit():
        label_feedback.config(
            text="Please enter a valid number!", fg="#d9534f"
        )
        return

    guess = int(user_input)
    tries += 1
    label_tries.config(text=f"Tries: {tries}")

    # Clear the input box for the next guess
    entry_guess.delete(0, tk.END)

    # Check the guess against the secret number
    if guess < secret:
        label_feedback.config(
            text=f"{guess} is too low! Try higher.", fg="#0275d8"
        )
    elif guess > secret:
        label_feedback.config(
            text=f"{guess} is too high! Try lower.", fg="#f0ad4e"
        )
    else:
        label_feedback.config(
            text=f"You got it in {tries} tries!", fg="#5cb85c"
        )
        btn_guess.config(state=tk.DISABLED)  # Disable button after winning
        entry_guess.config(state=tk.DISABLED)


def reset_game():
    global secret, tries
    secret = random.randint(1, 100)
    tries = 0

    # Reset UI elements back to normal
    label_tries.config(text="Tries: 0")
    label_feedback.config(text="Make your first guess!", fg="#333333")
    entry_guess.config(state=tk.NORMAL)
    btn_guess.config(state=tk.NORMAL)
    entry_guess.delete(0, tk.END)
    entry_guess.focus()


# --- Tkinter UI Setup ---
root = tk.Tk()
root.title("Number Guessing Game")
root.geometry("360x260")
root.resizable(False, False)

# Instruction Label
label_instruction = tk.Label(
    root,
    text="I am thinking of a number\nbetween 1 and 100",
    font=("Arial", 12, "bold"),
)
label_instruction.pack(pady=12)

# Input Box
entry_guess = tk.Entry(root, font=("Arial", 14), width=10, justify="center")
entry_guess.pack(pady=5)
entry_guess.focus()  # Automatically puts cursor in the box

# Bind the "Enter" key on your keyboard so you don't have to click the button every time
root.bind("<Return>", check_guess)

# Guess Button
btn_guess = tk.Button(
    root,
    text="Submit Guess",
    font=("Arial", 10, "bold"),
    command=check_guess,
    bg="#4CAF50",
    fg="white",
    padx=10,
)
btn_guess.pack(pady=5)

# Feedback Label (Replaces print statements)
label_feedback = tk.Label(
    root, text="Make your first guess!", font=("Arial", 11)
)
label_feedback.pack(pady=8)

# Tries Counter & Play Again Frame
bottom_frame = tk.Frame(root)
bottom_frame.pack(
    side=tk.BOTTOM, fill=tk.X, padx=20, pady=10
)

label_tries = tk.Label(bottom_frame, text="Tries: 0", font=("Arial", 10))
label_tries.pack(side=tk.LEFT)

btn_reset = tk.Button(
    bottom_frame, text="Play Again", font=("Arial", 9), command=reset_game
)
btn_reset.pack(side=tk.RIGHT)

# Start the Tkinter event loop
root.mainloop()