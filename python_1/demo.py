# rps_halloween_cheat_console.py
import random
import threading
import tkinter as tk
from tkinter import messagebox, simpledialog
import time
import os

# --- Optional packages (sound + voice) ---
try:
    import pygame
    pygame.mixer.init()
    SOUND_AVAILABLE = True
except Exception as e:
    SOUND_AVAILABLE = False
    print("pygame not available. Sound disabled.", e)

try:
    import speech_recognition as sr
    VOICE_AVAILABLE = True
except Exception as e:
    VOICE_AVAILABLE = False
    print("SpeechRecognition not available. Voice disabled.", e)

# --- Sound filenames (put files in same folder or change paths) ---
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
        if not os.path.isfile(fname):
            return
        s = pygame.mixer.Sound(fname)
        s.play()
    except Exception as e:
        print("Sound play error:", e)

# -----------------------------
# Game globals
# -----------------------------
user_score = 0
computer_score = 0
pumpkin_power_used = False
score_goal = 3
difficulty = "Easy"   # Easy/Medium/Hard
user_character = "🎃"
boss_mode_active = False
boss_threshold = 3    # user score that triggers boss
boss_defeated = False

options = ['rock', 'paper', 'scissor']
hand_emojis = {"rock": "✊", "paper": "✋", "scissor": "✌️"}

# adaptive tracking
user_move_counts = {"rock": 0, "paper": 0, "scissor": 0}

# secret buffer for typed Easter egg (keeps track of last letters typed)
secret_buffer = ""
SECRET_CODE = "trickortreat"

funny_bot_comments = [
    "😏 I’m just warming up...",
    "😂 Did you really think that would work?",
    "🧠 Big brain move... for me!",
    "👀 You got lucky this time!",
    "💀 I smell fear!",
    "🎃 Even ghosts play better than you!",
    "😎 I’m not programmed to lose!"
]

# ===== STORY MODE SECTION =====
# Story mode variables
story_mode = False
current_enemy_index = 0
enemy_score = 0
story_enemies = [
    {"name": "👻 Ghost Bot", "difficulty": "Easy", "rounds": 2, "bg": "#2f2f36"},
    {"name": "🧙 Witch Bot", "difficulty": "Medium", "rounds": 3, "bg": "#3a1a4a"},
    {"name": "💀 Boss Bot", "difficulty": "Hard", "rounds": 4, "bg": "#2b0712"}
]
enemy_target = story_enemies[0]["rounds"]

def start_story_mode_actual():
    """
    This begins story mode proper (called after the cutscene finishes).
    """
    global story_mode, current_enemy_index, enemy_score, user_score, computer_score, enemy_target
    story_mode = True
    current_enemy_index = 0
    enemy_score = 0
    user_score = 0
    computer_score = 0
    enemy_target = story_enemies[current_enemy_index]["rounds"]
    # change background for cinematic effect of first enemy
    try:
        root.config(bg=story_enemies[current_enemy_index].get("bg", MAIN_BG))
    except Exception:
        root.config(bg=MAIN_BG)
    messagebox.showinfo("Story Mode", f"🎮 STORY MODE ACTIVATED!\nFirst opponent: {story_enemies[current_enemy_index]['name']}")
    update_enemy_banner()

def next_enemy():
    """
    Move to the next enemy or finish story mode.
    """
    global current_enemy_index, enemy_score, story_mode, user_score, computer_score, enemy_target
    current_enemy_index += 1
    if current_enemy_index < len(story_enemies):
        enemy_score = 0
        user_score = 0
        computer_score = 0
        enemy_target = story_enemies[current_enemy_index]["rounds"]
        # change background color for flavor
        try:
            root.config(bg=story_enemies[current_enemy_index].get("bg", MAIN_BG))
        except Exception:
            root.config(bg=MAIN_BG)
        messagebox.showinfo("Next Battle!", f"Now facing {story_enemies[current_enemy_index]['name']} ({story_enemies[current_enemy_index]['difficulty']})")
        update_enemy_banner()
    else:
        story_mode = False
        # restore main bg
        root.config(bg=MAIN_BG)
        messagebox.showinfo("Victory!", "🎉 You defeated all haunted bots! You unlocked the Secret Ending!")
        update_enemy_banner()

def update_enemy_banner():
    """
    Update the comment_label depending on story mode or normal mode.
    """
    if 'comment_label' in globals():
        if story_mode:
            enemy = story_enemies[current_enemy_index]
            comment_label.config(text=f"⚔️ {enemy['name']} — {enemy['difficulty']} Mode")
        else:
            comment_label.config(text="👻 Welcome! Use the cheat console below (type help).")
# ===== END STORY MODE SECTION =====


# -----------------------------
# Utility & Game functions
# -----------------------------
def update_score_label():
    score_text.set(f"📊 Score: You {user_score} - Bot {computer_score}")

def update_hands(user_hand, bot_hand):
    user_hand_label.config(text=f"{user_character} You: {hand_emojis.get(user_hand, '')}" if user_hand else f"{user_character} You: ")
    computer_hand_label.config(text=f"🤖 Bot: {hand_emojis.get(bot_hand, '')}" if bot_hand else "🤖 Bot: ")

def reset_stats():
    global user_score, computer_score, pumpkin_power_used, boss_mode_active, boss_defeated, user_move_counts, story_mode
    user_score = 0
    computer_score = 0
    pumpkin_power_used = False
    boss_mode_active = False
    boss_defeated = False
    user_move_counts = {"rock": 0, "paper": 0, "scissor": 0}
    # If inside story mode, don't fully exit it; just reset scores.
    update_score_label()
    update_hands("", "")
    # restore main bg if not in story mode; if in story mode, keep that enemy bg
    if not story_mode:
        root.config(bg=MAIN_BG)
    comment_label.config(text="👻 New game! Choose your move...")
    root.focus_force()

# --- Adaptive bot ---
def get_adaptive_choice():
    total = sum(user_move_counts.values())
    if total == 0:
        return random.choice(options)
    most = max(user_move_counts, key=lambda k: user_move_counts[k])
    counter = {"rock": "paper", "paper": "scissor", "scissor": "rock"}
    if difficulty == "Easy":
        if random.random() < 0.25:
            return counter[most]
        return random.choice(options)
    elif difficulty == "Medium":
        if random.random() < 0.5:
            return counter[most]
        return random.choice(options)
    else:  # Hard
        bias = 0.8 if not boss_mode_active else 0.95
        if random.random() < bias:
            return counter[most]
        return random.choice(options)

def get_bot_choice():
    # When in story mode, we can bias selection by that enemy's difficulty if desired.
    if boss_mode_active:
        return get_adaptive_choice()
    else:
        if story_mode:
            # Slightly bias by current enemy difficulty
            enemy = story_enemies[current_enemy_index]
            ed = enemy.get("difficulty", "Easy").lower()
            if ed == "easy":
                if random.random() < 0.25:
                    return get_adaptive_choice()
                return random.choice(options)
            elif ed == "medium":
                if random.random() < 0.5:
                    return get_adaptive_choice()
                return random.choice(options)
            else:  # hard
                if random.random() < 0.75:
                    return get_adaptive_choice()
                return random.choice(options)
        else:
            if difficulty == "Easy":
                return random.choice(options)
            elif difficulty == "Medium":
                if random.random() < 0.35:
                    return get_adaptive_choice()
                return random.choice(options)
            else:  # Hard
                if random.random() < 0.7:
                    return get_adaptive_choice()
                return random.choice(options)

# --- Boss handling ---
def check_for_boss():
    global boss_mode_active
    if not boss_mode_active and user_score >= boss_threshold and not boss_defeated:
        boss_mode_active = True
        comment_label.config(text="👹 Boss Battle! The Boss Bot appears...")
        play_sound(S_BOSS)
        root.config(bg="#2b0712")
        root.after(1200, lambda: comment_label.config(text="💀 Boss is ready! Choose carefully..."))

def normal_victory():
    messagebox.showinfo("You Win!", f"🎉 You reached {score_goal} wins! You defeated the bot.", parent=root)
    reset_stats()

def normal_loss():
    messagebox.showinfo("You Lose", f"🤖 The bot reached {score_goal} wins. Better luck next time.", parent=root)
    reset_stats()

def boss_victory():
    global boss_defeated, boss_mode_active
    boss_defeated = True
    boss_mode_active = False
    update_score_label()
    messagebox.showinfo("Boss Defeated!", "🏆 You defeated the Boss Bot! Congratulations!", parent=root)
    root.config(bg=MAIN_BG)
    play_sound(S_BOSS)
    reset_stats()

# --- main play round ---
def play_round(user_choice):
    global user_score, computer_score
    # record user move
    user_move_counts[user_choice] += 1

    bot_choice = get_bot_choice()

    update_hands(user_choice, bot_choice)

    if user_choice == bot_choice:
        comment_label.config(text="😐 It's a tie — no points.")
        play_sound(S_TIE)
        return

    # user win conditions
    if (user_choice == "rock" and bot_choice == "scissor") or \
       (user_choice == "paper" and bot_choice == "rock") or \
       (user_choice == "scissor" and bot_choice == "paper"):
        user_score += 1
        comment_label.config(text=random.choice([
            "✅ You win this round!",
            "🎃 You smashed the bot!",
            "🔥 Nice move!"
        ]))
        play_sound(S_WIN)
    else:
        computer_score += 1
        comment_label.config(text=random.choice(funny_bot_comments))
        play_sound(S_LOSE)

    update_score_label()
    check_for_boss()

    # ===== STORY MODE ROUND CHECK =====
    if story_mode:
        # in story mode, threshold is enemy_target rounds
        if user_score >= enemy_target:
            messagebox.showinfo("Victory!", f"You defeated {story_enemies[current_enemy_index]['name']}!")
            next_enemy()
        elif computer_score >= enemy_target:
            messagebox.showinfo("Defeat!", "💀 You were defeated! Restarting story mode...")
            # play cutscene again then restart story
            play_test_cutscene_then_start_story()
        return
    # ===== END STORY MODE ROUND CHECK =====

    # victory conditions (normal mode)
    if user_score >= score_goal:
        if boss_mode_active and not boss_defeated:
            boss_extra = 2
            if user_score >= score_goal + boss_extra:
                boss_victory()
            else:
                comment_label.config(text="🏁 You weakened the Boss — keep fighting!")
        else:
            normal_victory()
    elif computer_score >= score_goal:
        normal_loss()

# --- Cheat functions & Easter egg ---
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

def force_boss_battle():
    global boss_mode_active
    if boss_mode_active:
        comment_label.config(text="👾 Boss already active!")
        return
    boss_mode_active = True
    comment_label.config(text="👹 Boss forced! Prepare...")
    play_sound(S_BOSS)
    root.config(bg="#2b0712")
    root.after(1000, lambda: comment_label.config(text="💀 Boss is ready!"))

def do_easter_egg():
    global user_score
    comment_label.config(text="🎃 Trick or Treat! Pumpkin theme unlocked +1 bonus point!")
    play_sound(S_BOSS)
    root.config(bg="#2b001a")
    user_score += 1
    update_score_label()

# --- Secret buffer handler for typed Easter code via general keypresses ---
def secret_key_pressed(event):
    global secret_buffer
    try:
        c = event.char.lower()
    except Exception:
        return
    if not c:
        return
    if c.isprintable():
        secret_buffer += c
        if len(secret_buffer) > len(SECRET_CODE):
            secret_buffer = secret_buffer[-len(SECRET_CODE):]
        if secret_buffer == SECRET_CODE:
            secret_buffer = ""
            do_easter_egg()

# --- Voice mode (threaded listen) ---
voice_mode_on = False
voice_thread = None

def toggle_voice_mode():
    global voice_mode_on, voice_thread
    if not VOICE_AVAILABLE:
        messagebox.showwarning("Voice Not Available", "SpeechRecognition not installed or microphone not accessible.", parent=root)
        return
    if voice_mode_on:
        voice_mode_on = False
        voice_button.config(text="🎤 Voice: OFF", bg="#444")
    else:
        voice_mode_on = True
        voice_button.config(text="🎤 Voice: LISTENING...", bg="#2aa")
        voice_thread = threading.Thread(target=listen_once, daemon=True)
        voice_thread.start()

def listen_once():
    global voice_mode_on
    try:
        play_sound(S_VOICE)
        r = sr.Recognizer()
        with sr.Microphone() as mic:
            r.adjust_for_ambient_noise(mic, duration=0.5)
            audio = r.listen(mic, timeout=5, phrase_time_limit=3)
        text = r.recognize_google(audio).lower()
        print("Recognized:", text)
        if "rock" in text:
            root.after(50, lambda: play_round("rock"))
        elif "paper" in text:
            root.after(50, lambda: play_round("paper"))
        elif "scissor" in text or "scissors" in text:
            root.after(50, lambda: play_round("scissor"))
        else:
            root.after(50, lambda: comment_label.config(text="❓Couldn't understand. Say rock / paper / scissor."))
    except Exception as e:
        print("Voice error:", e)
        root.after(50, lambda: messagebox.showwarning("Voice Error", "Voice input failed. Check mic and pyaudio.", parent=root))
    finally:
        voice_mode_on = False
        root.after(50, lambda: voice_button.config(text="🎤 Voice: OFF", bg="#444"))

# ===== CUTSCENE / "TEST VIDEO" IMPLEMENTATION =====
def play_test_cutscene_then_start_story():
    """
    Plays a small animated cutscene (self-contained).
    After it finishes, it calls start_story_mode_actual().
    """
    # Create modal top-level window
    cut = tk.Toplevel(root)
    cut.transient(root)
    cut.grab_set()
    cut.title("🎬 Story Intro")
    # We'll center it and make it slightly larger than the main canvas area
    w, h = 700, 380
    x = root.winfo_x() + max((root.winfo_width() - w)//2, 0)
    y = root.winfo_y() + max((root.winfo_height() - h)//2, 0)
    cut.geometry(f"{w}x{h}+{x}+{y}")
    cut.config(bg="black")

    # Canvas for simple animation
    canvas = tk.Canvas(cut, width=w, height=h, bg="black", highlightthickness=0)
    canvas.pack(fill="both", expand=True)

    # Title text
    title = canvas.create_text(w//2, 60, text="🎃 Haunted Tournament — Story Intro", font=("Arial", 22, "bold"), fill="orange")

    # Animated pumpkins (as circles with faces) moving across
    pumpkins = []
    for i in range(6):
        px = -100 - i*110
        py = h//2 + (i%2)*30 - 20
        oval = canvas.create_oval(px, py, px+80, py+80, fill="#ff8c42", outline="")
        eyes = canvas.create_oval(px+20, py+20, px+30, py+30, fill="black")
        eye2 = canvas.create_oval(px+50, py+20, px+60, py+30, fill="black")
        mouth = canvas.create_line(px+20, py+55, px+60, py+55, fill="black", width=3)
        pumpkins.append((oval, eyes, eye2, mouth))

    start_time = time.time()
    duration = 5.0  # seconds

    def animate():
        t = time.time() - start_time
        progress = t / duration
        for idx, parts in enumerate(pumpkins):
            oval, eyes, eye2, mouth = parts
            # Move each pumpkin to right based on time (wrap)
            curr = canvas.coords(oval)
            if not curr:
                continue
            # shift to right
            canvas.move(oval, 6, 0)
            canvas.move(eyes, 6, 0)
            canvas.move(eye2, 6, 0)
            canvas.move(mouth, 6, 0)
            # if off screen, wrap to left
            coords = canvas.coords(oval)
            if coords and coords[0] > w + 50:
                dx = - (w + 200)
                canvas.move(oval, dx, 0)
                canvas.move(eyes, dx, 0)
                canvas.move(eye2, dx, 0)
                canvas.move(mouth, dx, 0)
        # Flicker text for spooky feel
        if int(t*4) % 2 == 0:
            canvas.itemconfig(title, fill="orange")
        else:
            canvas.itemconfig(title, fill="#ffd27f")
        if t < duration:
            cut.after(40, animate)
        else:
            # clean up and start story
            try:
                cut.grab_release()
                cut.destroy()
            except Exception:
                pass
            # call the actual start of story mode
            start_story_mode_actual()

    # Start animation after short delay
    cut.after(80, animate)
# ===== END CUTSCENE SECTION =====


# --- UI: build window with always-visible cheat console ---
MAIN_BG = "#1e0f1a"
root = tk.Tk()
root.title("🎃 RPS: Halloween Ultimate (Cheat Console Visible)")
root.geometry("580x700")
root.config(bg=MAIN_BG)

# Title
tk.Label(root, text="🎃 Halloween Rock, Paper, Scissors — Ultimate", font=("Arial", 16, "bold"), fg="orange", bg=MAIN_BG).pack(pady=8)
tk.Label(root, text="Use buttons, voice, or the cheat console below. Type commands and press Enter.", font=("Arial", 10), fg="white", bg=MAIN_BG).pack()

# Menu row
menu_frame = tk.Frame(root, bg=MAIN_BG)
menu_frame.pack(pady=8)

def choose_character_dialog():
    global user_character
    choice = simpledialog.askstring("Character", "Enter an emoji or name for your character (eg 🎃, 🧙, 👻):", parent=root)
    if choice and choice.strip():
        user_character = choice.strip()
    else:
        user_character = "🎃"
    user_hand_label.config(text=f"{user_character} You: ")

def choose_goal_dialog():
    global score_goal
    try:
        g = simpledialog.askinteger("Score Goal", "How many wins needed to win (e.g. 3, 5, 7)?", parent=root, minvalue=1, maxvalue=50)
        if g is not None:
            score_goal = int(g)
            update_score_label()
            messagebox.showinfo("Goal Set", f"First to {score_goal} wins!", parent=root)
    except Exception as e:
        messagebox.showwarning("Invalid", "Please enter a valid number.", parent=root)

def choose_difficulty_dialog():
    global difficulty
    d = simpledialog.askstring("Difficulty", "Choose difficulty: Easy, Medium, Hard", parent=root)
    if d is None:
        return
    d = d.strip().lower()
    if d in ("easy", "medium", "hard"):
        difficulty = d.capitalize()
        messagebox.showinfo("Difficulty", f"Difficulty set to {difficulty}", parent=root)
    else:
        messagebox.showwarning("Invalid", "Enter Easy, Medium or Hard.", parent=root)

tk.Button(menu_frame, text="🎭 Character", command=choose_character_dialog, bg="orange", fg="black").grid(row=0, column=0, padx=6)
tk.Button(menu_frame, text="🏆 Goal", command=choose_goal_dialog, bg="orange", fg="black").grid(row=0, column=1, padx=6)
tk.Button(menu_frame, text="💀 Difficulty", command=choose_difficulty_dialog, bg="orange", fg="black").grid(row=0, column=2, padx=6)

# Game buttons
frame = tk.Frame(root, bg=MAIN_BG)
frame.pack(pady=12)
tk.Button(frame, text="Rock 🪨", width=12, command=lambda: play_round_button("rock"), bg="#ff8c42").grid(row=0, column=0, padx=6)
tk.Button(frame, text="Paper 📄", width=12, command=lambda: play_round_button("paper"), bg="#ff8c42").grid(row=0, column=1, padx=6)
tk.Button(frame, text="Scissor ✂️", width=12, command=lambda: play_round_button("scissor"), bg="#ff8c42").grid(row=0, column=2, padx=6)

def play_round_button(choice):
    root.after(10, lambda: play_round(choice))

# Hands and score
user_hand_label = tk.Label(root, text=f"{user_character} You: ", font=("Arial", 26), bg=MAIN_BG, fg="white")
user_hand_label.pack(pady=6)
computer_hand_label = tk.Label(root, text="🤖 Bot: ", font=("Arial", 26), bg=MAIN_BG, fg="white")
computer_hand_label.pack(pady=6)

score_text = tk.StringVar(value=f"📊 Score: You {user_score} - Bot {computer_score}")
tk.Label(root, textvariable=score_text, font=("Arial", 13, "bold"), bg=MAIN_BG, fg="orange").pack(pady=8)

comment_label = tk.Label(root, text="👻 Welcome! Use the cheat console below (type help).", font=("Arial", 11), bg=MAIN_BG, fg="#bfffcf")
comment_label.pack(pady=6)

# Bottom controls
bottom_frame = tk.Frame(root, bg=MAIN_BG)
bottom_frame.pack(pady=10)
tk.Button(bottom_frame, text="🔁 Restart", command=lambda: (reset_stats(), root.config(bg=MAIN_BG)), bg="#ff7518").grid(row=0, column=0, padx=6)
tk.Button(bottom_frame, text="🔓 Pumpkin Power (TEST)", command=activate_pumpkin_power, bg="#ff7518").grid(row=0, column=1, padx=6)
voice_button = tk.Button(bottom_frame, text="🎤 Voice: OFF", command=toggle_voice_mode, bg="#444", fg="white")
voice_button.grid(row=0, column=2, padx=6)

# Cheat console (always visible)
console_frame = tk.Frame(root, bg="#0f0f12")
console_frame.pack(fill="x", padx=12, pady=10)
tk.Label(console_frame, text="Cheat Console:", font=("Arial", 10, "bold"), bg="#0f0f12", fg="orange").pack(anchor="w", pady=4)

entry_frame = tk.Frame(console_frame, bg="#0f0f12")
entry_frame.pack(fill="x")

console_entry = tk.Entry(entry_frame, font=("Arial", 12))
console_entry.pack(side="left", fill="x", expand=True, padx=(0,8))
console_entry.insert(0, "")  # empty by default

def process_console_command(event=None):
    cmd = console_entry.get().strip().lower()
    if not cmd:
        return
    console_entry.delete(0, tk.END)
    if cmd == "pumpkinpower":
        activate_pumpkin_power()
    elif cmd == "trickortreat":
        do_easter_egg()
    elif cmd == "bossbattle":
        force_boss_battle()
    elif cmd == "reset":
        reset_stats()
    elif cmd == "storymode":
        # Play the test cutscene (acts as the "video") then start story mode
        play_test_cutscene_then_start_story()
    elif cmd == "help":
        messagebox.showinfo("Cheat Console Help", "Commands:\n- pumpkinpower\n- trickortreat\n- bossbattle\n- storymode\n- reset\n- help", parent=root)
    else:
        messagebox.showinfo("Unknown Command", f"'{cmd}' is not recognized. Type 'help' for commands.", parent=root)

# bind Enter to process command
console_entry.bind("<Return>", process_console_command)

# also allow clicking an execute button
tk.Button(entry_frame, text="Run", command=process_console_command, bg="#ff7518").pack(side="right")

# secret typed Easter egg via keyboard as well
root.bind_all("<Key>", secret_key_pressed)

# cheat keybindings (robust)
root.bind_all("<Control-Shift-P>", activate_pumpkin_power)
root.bind_all("<Control-Shift-p>", activate_pumpkin_power)
root.bind_all("<Command-Shift-P>", activate_pumpkin_power)
root.bind_all("<Command-Shift-p>", activate_pumpkin_power)

# ensure focus
root.focus_force()

# initial ready sound
play_sound(S_VOICE)

update_score_label()

root.mainloop()

Print("you did'nt do the work ")
