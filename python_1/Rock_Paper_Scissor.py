# rps_bot_quick.py
"""
Quick Rock-Paper-Scissors Bot (Halloween edition)
Features:
- Adaptive bot (learns your moves)
- Boss Battle mode
- Pumpkin Power cheat (+1, one-time)
- Always-visible cheat console (commands: pumpkinpower, reset, help, trickortreat)
- Voice Mode (optional; uses SpeechRecognition + pyaudio)
- Sound effects if pygame is installed
- Halloween UI with Tkinter
"""

import random
import threading
import tkinter as tk
from tkinter import messagebox, simpledialog
import os

# Optional: sound support via pygame
SOUND_AVAILABLE = False
try:
    import pygame
    pygame.mixer.init()
    SOUND_AVAILABLE = True
except Exception:
    SOUND_AVAILABLE = False

# Optional: voice support via SpeechRecognition (requires pyaudio)
VOICE_AVAILABLE = False
try:
    import speech_recognition as sr
    VOICE_AVAILABLE = True
except Exception:
    VOICE_AVAILABLE = False

# Sound filenames (put WAV files next to this script or leave them missing)
S_WIN = "win.wav"
S_LOSE = "lose.wav"
S_TIE = "tie.wav"
S_BOSS = "boss.wav"
S_CHEAT = "cheat.wav"
S_VOICE = "voice_beep.wav"

def play_sound(fname):
    if not SOUND_AVAILABLE:
        return
    try:
        if os.path.isfile(fname):
            pygame.mixer.Sound(fname).play()
    except Exception:
        pass

# ---------------- Game state ----------------
user_score = 0
computer_score = 0
score_goal = 4                # default; can change via menu
difficulty = "Easy"           # Easy / Medium / Hard
user_character = "🎃"
pumpkin_power_used = False
boss_mode_active = False
boss_defeated = False
boss_threshold = 3            # when user's score reaches this, boss may appear

options = ["rock", "paper", "scissor"]
hand_emojis = {"rock":"✊", "paper":"✋", "scissor":"✌️"}

# adaptive tracking
user_move_counts = {"rock":0, "paper":0, "scissor":0}

# secret Easter egg typing buffer
secret_buffer = ""
SECRET_CODE = "trickortreat"

# funny bot comments
funny_bot_comments = [
    "😏 I’m just warming up...",
    "😂 Did you really think that would work?",
    "🧠 Big brain move... for me!",
    "👀 You got lucky this time!",
    "💀 I smell fear!",
    "🎃 Even ghosts play better than you!",
    "😎 I’m not programmed to lose!"
]

# ---------------- Utilities & Game Logic ----------------
def update_score_label():
    score_text.set(f"📊 Score: You {user_score} - Bot {computer_score}")

def update_hands(user_hand="", bot_hand=""):
    user_hand_label.config(text=f"{user_character} You: {hand_emojis.get(user_hand,'')}")
    computer_hand_label.config(text=f"🤖 Bot: {hand_emojis.get(bot_hand,'')}")

def reset_stats():
    global user_score, computer_score, pumpkin_power_used, boss_mode_active, boss_defeated, user_move_counts
    user_score = 0
    computer_score = 0
    pumpkin_power_used = False
    boss_mode_active = False
    boss_defeated = False
    user_move_counts = {"rock":0, "paper":0, "scissor":0}
    update_score_label()
    update_hands("","")
    comment_label.config(text="👻 New game! Choose your move...")
    root.config(bg=MAIN_BG)

def get_adaptive_choice():
    total = sum(user_move_counts.values())
    if total == 0:
        return random.choice(options)
    most = max(user_move_counts, key=lambda k: user_move_counts[k])
    counter = {"rock":"paper","paper":"scissor","scissor":"rock"}
    # bias depends on difficulty
    if difficulty == "Easy":
        bias = 0.25
    elif difficulty == "Medium":
        bias = 0.5
    else:
        bias = 0.85
    # boss mode makes AI stronger
    if boss_mode_active:
        bias = min(1.0, bias + 0.15)
    if random.random() < bias:
        return counter[most]
    return random.choice(options)

def check_for_boss():
    global boss_mode_active
    if not boss_mode_active and user_score >= boss_threshold and not boss_defeated:
        boss_mode_active = True
        comment_label.config(text="👹 Boss Battle! The Boss Bot appears...")
        play_sound(S_BOSS)
        root.config(bg="#2b0712")
        root.after(1200, lambda: comment_label.config(text="💀 Boss is ready!"))

def normal_victory():
    messagebox.showinfo("You Win!", f"🎉 You reached {score_goal} wins and beat the bot!", parent=root)
    reset_stats()

def normal_loss():
    messagebox.showinfo("You Lose", f"🤖 Bot reached {score_goal} wins. Try again!", parent=root)
    reset_stats()

def boss_victory():
    global boss_defeated, boss_mode_active
    boss_defeated = True
    boss_mode_active = False
    update_score_label()
    messagebox.showinfo("Boss Defeated!", "🏆 You defeated the Boss Bot!", parent=root)
    root.config(bg=MAIN_BG)
    reset_stats()

def apply_round_result(user_choice, bot_choice):
    global user_score, computer_score
    update_hands(user_choice, bot_choice)
    if user_choice == bot_choice:
        comment_label.config(text="😐 It's a tie — no points.")
        play_sound(S_TIE)
        return
    # determine winner
    if (user_choice=="rock" and bot_choice=="scissor") or \
       (user_choice=="paper" and bot_choice=="rock") or \
       (user_choice=="scissor" and bot_choice=="paper"):
        user_score += 1
        comment_label.config(text=random.choice(["✅ You win this round!", "🎃 You smashed the bot!", "🔥 Nice move!"]))
        play_sound(S_WIN)
    else:
        computer_score += 1
        comment_label.config(text=random.choice(funny_bot_comments))
        play_sound(S_LOSE)
    update_score_label()
    check_for_boss()
    # check victory conditions
    if user_score >= score_goal:
        if boss_mode_active and not boss_defeated:
            # require extra wins to beat boss (example: +2)
            if user_score >= score_goal + 2:
                boss_victory()
            else:
                comment_label.config(text="🏁 You weakened the Boss — keep fighting!")
        else:
            normal_victory()
    elif computer_score >= score_goal:
        normal_loss()

def play_round(user_choice):
    # called when user selects a move
    global user_move_counts
    user_move_counts[user_choice] += 1
    bot_choice = get_adaptive_choice()
    apply_round_result(user_choice, bot_choice)

# ---------------- Cheats ----------------
def activate_pumpkin_power(event=None):
    global pumpkin_power_used, user_score
    if pumpkin_power_used:
        messagebox.showwarning("No Cheating Twice!", "You already used Pumpkin Power!", parent=root)
        return
    pumpkin_power_used = True
    user_score += 1
    update_score_label()
    comment_label.config(text="🎃 Pumpkin Power activated! +1 point")
    play_sound(S_CHEAT)
    check_for_boss()

def do_easter_egg():
    global user_score
    user_score += 1
    update_score_label()
    root.config(bg="#2b001a")
    comment_label.config(text="🎃 Trick or Treat! Bonus point awarded!")

# ---------------- Voice (threaded) ----------------
voice_listening = False
def listen_once():
    global voice_listening
    if not VOICE_AVAILABLE:
        root.after(50, lambda: messagebox.showinfo("Voice", "Voice support not installed (SpeechRecognition)."))
        return
    try:
        play_sound(S_VOICE)
        r = sr.Recognizer()
        with sr.Microphone() as mic:
            r.adjust_for_ambient_noise(mic, duration=0.4)
            audio = r.listen(mic, timeout=5, phrase_time_limit=3)
        text = r.recognize_google(audio).lower()
        # map recognized text to moves
        if "rock" in text:
            root.after(50, lambda: play_round("rock"))
        elif "paper" in text:
            root.after(50, lambda: play_round("paper"))
        elif "scissor" in text or "scissors" in text:
            root.after(50, lambda: play_round("scissor"))
        else:
            root.after(50, lambda: comment_label.config(text="❓ Couldn't understand. Say rock/paper/scissor."))
    except Exception as e:
        root.after(50, lambda: messagebox.showwarning("Voice Error", f"Voice input failed: {e}"))
    finally:
        voice_listening = False
        voice_button.config(text="🎤 Voice: OFF", bg="#444")

def toggle_voice_mode():
    global voice_listening
    if not VOICE_AVAILABLE:
        messagebox.showinfo("Voice", "Voice support not installed (SpeechRecognition).")
        return
    if voice_listening:
        voice_listening = False
        voice_button.config(text="🎤 Voice: OFF", bg="#444")
    else:
        voice_listening = True
        voice_button.config(text="🎤 Voice: LISTENING...", bg="#2aa")
        t = threading.Thread(target=listen_once, daemon=True)
        t.start()

# ---------------- Cheat console processing ----------------
def process_console_command(cmd):
    c = cmd.strip().lower()
    if not c:
        return
    if c == "pumpkinpower":
        activate_pumpkin_power()
    elif c == "reset":
        reset_stats()
    elif c == "help":
        messagebox.showinfo("Commands", "pumpkinpower, reset, help, trickortreat")
    elif c == "trickortreat":
        do_easter_egg()
    else:
        messagebox.showinfo("Unknown", f"Unknown command: {c}")

# ---------------- UI building ----------------
MAIN_BG = "#1e0f1a"
root = tk.Tk()
root.title("🎃 RPS Bot Quick — Halloween Edition")
root.geometry("560x680")
root.config(bg=MAIN_BG)

tk.Label(root, text="🎃 Halloween RPS — Bot Quick", font=("Arial", 16, "bold"), fg="orange", bg=MAIN_BG).pack(pady=8)
tk.Label(root, text="Choose a move, use cheat console, or enable voice.", bg=MAIN_BG, fg="white").pack()

# Top menu
menu_frame = tk.Frame(root, bg=MAIN_BG)
menu_frame.pack(pady=8)
def set_character():
    global user_character
    s = simpledialog.askstring("Character", "Enter emoji or symbol for your character (e.g. 🎃)", parent=root)
    if s:
        user_character = s.strip()
        update_hands("","")
tk.Button(menu_frame, text="🎭 Character", command=set_character, bg="orange").grid(row=0, column=0, padx=6)
def set_goal():
    global score_goal
    g = simpledialog.askinteger("Score Goal", "Enter wins needed (e.g. 3,4,5)", parent=root, minvalue=1, maxvalue=50)
    if g:
        score_goal = int(g)
        update_score_label()
tk.Button(menu_frame, text="🏆 Goal", command=set_goal, bg="orange").grid(row=0, column=1, padx=6)
def set_difficulty():
    global difficulty, boss_threshold
    d = simpledialog.askstring("Difficulty", "Enter difficulty: Easy, Medium, or Hard", parent=root)
    if d and d.strip().lower() in ("easy","medium","hard"):
        difficulty = d.strip().capitalize()
        # adjust boss threshold and optionally other params
        boss_threshold = 3 if difficulty=="Easy" else (3 if difficulty=="Medium" else 2)
        messagebox.showinfo("Difficulty Set", f"Difficulty set to {difficulty}")
    else:
        messagebox.showwarning("Invalid", "Please choose Easy, Medium or Hard.")
tk.Button(menu_frame, text="💀 Difficulty", command=set_difficulty, bg="orange").grid(row=0, column=2, padx=6)

# Play buttons
btn_frame = tk.Frame(root, bg=MAIN_BG)
btn_frame.pack(pady=14)
tk.Button(btn_frame, text="Rock 🪨", width=12, command=lambda: play_round("rock"), bg="#ff8c42").grid(row=0, column=0, padx=6)
tk.Button(btn_frame, text="Paper 📄", width=12, command=lambda: play_round("paper"), bg="#ff8c42").grid(row=0, column=1, padx=6)
tk.Button(btn_frame, text="Scissor ✂️", width=12, command=lambda: play_round("scissor"), bg="#ff8c42").grid(row=0, column=2, padx=6)

# Hands & score
user_hand_label = tk.Label(root, text=f"{user_character} You:", font=("Arial", 24), bg=MAIN_BG, fg="white")
user_hand_label.pack(pady=6)
computer_hand_label = tk.Label(root, text="🤖 Bot:", font=("Arial", 24), bg=MAIN_BG, fg="white")
computer_hand_label.pack(pady=6)

score_text = tk.StringVar()
update_score_label()
tk.Label(root, textvariable=score_text, font=("Arial", 14, "bold"), bg=MAIN_BG, fg="orange").pack(pady=6)
comment_label = tk.Label(root, text="👻 Welcome! Use the cheat console below.", bg=MAIN_BG, fg="#bfffcf")
comment_label.pack(pady=6)

# Bottom controls
bottom = tk.Frame(root, bg=MAIN_BG)
bottom.pack(pady=10)
tk.Button(bottom, text="🔁 Restart", command=reset_stats, bg="#ff7518").grid(row=0, column=0, padx=6)
tk.Button(bottom, text="🎃 Pumpkin Power", command=activate_pumpkin_power, bg="#ff7518").grid(row=0, column=1, padx=6)
voice_button = tk.Button(bottom, text="🎤 Voice: OFF", command=toggle_voice_mode, bg="#444", fg="white")
voice_button.grid(row=0, column=2, padx=6)

# Cheat console (visible)
console_frame = tk.Frame(root, bg="#0f0f12")
console_frame.pack(fill="x", padx=12, pady=10)
tk.Label(console_frame, text="💻 Cheat Console:", bg="#0f0f12", fg="orange").pack(anchor="w", pady=4)
console_entry = tk.Entry(console_frame, font=("Arial", 12))
console_entry.pack(fill="x", padx=6, pady=4)

def on_console_enter(event=None):
    cmd = console_entry.get().strip()
    console_entry.delete(0, tk.END)
    process_console_command(cmd)

console_entry.bind("<Return>", on_console_enter)
tk.Button(console_frame, text="Run", command=lambda: on_console_enter(), bg="#ff7518").pack(side="right", padx=6)

# Bind secret typing for Easter egg
def secret_keypress(event):
    global secret_buffer
    ch = event.char.lower() if hasattr(event, "char") else ""
    if ch and ch.isprintable():
        secret_buffer += ch
        if len(secret_buffer) > len(SECRET_CODE):
            secret_buffer = secret_buffer[-len(SECRET_CODE):]
        if secret_buffer == SECRET_CODE:
            secret_buffer = ""
            do_easter_egg()

root.bind_all("<Key>", secret_keypress)
# Bind Ctrl+Shift+P for pumpkin power
root.bind_all("<Control-Shift-P>", lambda e: activate_pumpkin_power())
root.bind_all("<Control-Shift-p>", lambda e: activate_pumpkin_power())

# Ready
play_sound(S_VOICE)
root.mainloop()
