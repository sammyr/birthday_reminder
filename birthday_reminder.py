import tkinter as tk
from tkinter import ttk, messagebox
from tkcalendar import Calendar
import json
from datetime import datetime
import os

class BirthdayReminder:
    def __init__(self, root):
        self.root = root
        self.root.title("Birthday Reminder")
        self.root.geometry("800x600")
        
        # Data storage
        self.birthdays = {}
        self.data_file = "birthdays.json"
        self.load_birthdays()
        
        # Create main frames
        self.create_frames()
        self.create_calendar()
        self.create_entry_section()
        self.create_birthday_list()
        
        # Check for upcoming birthdays
        self.check_upcoming_birthdays()

    def create_frames(self):
        # Left frame for calendar
        self.left_frame = ttk.Frame(self.root)
        self.left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Right frame for entries and list
        self.right_frame = ttk.Frame(self.root)
        self.right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)

    def create_calendar(self):
        self.cal = Calendar(self.left_frame, selectmode='day', date_pattern='y-mm-dd')
        self.cal.pack(fill=tk.BOTH, expand=True)
        
        # Highlight dates with birthdays
        self.update_calendar_markers()

    def create_entry_section(self):
        # Entry section
        entry_frame = ttk.LabelFrame(self.right_frame, text="Add Birthday")
        entry_frame.pack(fill=tk.X, padx=5, pady=5)
        
        ttk.Label(entry_frame, text="Name:").pack(pady=2)
        self.name_entry = ttk.Entry(entry_frame)
        self.name_entry.pack(fill=tk.X, padx=5, pady=2)
        
        ttk.Button(entry_frame, text="Add Birthday", command=self.add_birthday).pack(pady=5)

    def create_birthday_list(self):
        # Birthday list section
        list_frame = ttk.LabelFrame(self.right_frame, text="Birthday List")
        list_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        # Create treeview
        self.tree = ttk.Treeview(list_frame, columns=('Name', 'Date'), show='headings')
        self.tree.heading('Name', text='Name')
        self.tree.heading('Date', text='Date')
        self.tree.pack(fill=tk.BOTH, expand=True)
        
        # Add delete button
        ttk.Button(list_frame, text="Delete Selected", command=self.delete_birthday).pack(pady=5)
        
        # Update the list
        self.update_birthday_list()

    def add_birthday(self):
        name = self.name_entry.get().strip()
        date = self.cal.get_date()
        
        if not name:
            messagebox.showerror("Error", "Please enter a name")
            return
            
        self.birthdays[name] = date
        self.save_birthdays()
        self.update_birthday_list()
        self.update_calendar_markers()
        self.name_entry.delete(0, tk.END)
        messagebox.showinfo("Success", f"Birthday added for {name}")

    def delete_birthday(self):
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showerror("Error", "Please select a birthday to delete")
            return
            
        name = self.tree.item(selected_item)['values'][0]
        if name in self.birthdays:
            del self.birthdays[name]
            self.save_birthdays()
            self.update_birthday_list()
            self.update_calendar_markers()
            messagebox.showinfo("Success", f"Birthday deleted for {name}")

    def update_birthday_list(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        sorted_birthdays = sorted(self.birthdays.items(), 
                                key=lambda x: datetime.strptime(x[1], '%Y-%m-%d').strftime('%m-%d'))
        
        for name, date in sorted_birthdays:
            self.tree.insert('', tk.END, values=(name, date))

    def update_calendar_markers(self):
        # Reset calendar colors
        self.cal.calevent_remove('all')
        
        # Add markers for birthdays
        for date in self.birthdays.values():
            self.cal.calevent_create(datetime.strptime(date, '%Y-%m-%d'), 
                                   'birthday', 'Birthday')
        
        # Configure tag
        self.cal.tag_config('birthday', background='light blue')

    def load_birthdays(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    self.birthdays = json.load(f)
            except:
                self.birthdays = {}

    def save_birthdays(self):
        with open(self.data_file, 'w') as f:
            json.dump(self.birthdays, f)

    def check_upcoming_birthdays(self):
        today = datetime.now()
        upcoming = []
        
        for name, date_str in self.birthdays.items():
            bday = datetime.strptime(date_str, '%Y-%m-%d')
            bday = bday.replace(year=today.year)
            
            if bday < today:
                bday = bday.replace(year=today.year + 1)
                
            days_until = (bday - today).days
            
            if 0 <= days_until <= 7:
                upcoming.append((name, days_until))
        
        if upcoming:
            message = "Upcoming birthdays:\n\n"
            for name, days in upcoming:
                message += f"{name}: {days} days away\n"
            messagebox.showinfo("Upcoming Birthdays", message)

if __name__ == "__main__":
    root = tk.Tk()
    app = BirthdayReminder(root)
    root.mainloop()
