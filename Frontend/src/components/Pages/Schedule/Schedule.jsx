import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    Calendar as CalendarIcon
} from 'lucide-react';

const Schedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('pomodoro_scheduler_tasks');
        return saved ? JSON.parse(saved) : {};
    });
    const [newTaskText, setNewTaskText] = useState('');

    // Persist tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('pomodoro_scheduler_tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Calendar calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const formatDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const selectedKey = formatDateKey(selectedDate);
    const selectedTasks = tasks[selectedKey] || [];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            text: newTaskText.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        setTasks((prev) => ({
            ...prev,
            [selectedKey]: [...(prev[selectedKey] || []), newTask]
        }));

        setNewTaskText('');
    };

    const toggleTask = (taskId) => {
        setTasks((prev) => ({
            ...prev,
            [selectedKey]: (prev[selectedKey] || []).map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            )
        }));
    };

    const deleteTask = (taskId) => {
        setTasks((prev) => ({
            ...prev,
            [selectedKey]: (prev[selectedKey] || []).filter((t) => t.id !== taskId)
        }));
    };

    // Build grid days
    const calendarDays = [];

    // Previous month trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            date: new Date(year, month - 1, daysInPrevMonth - i)
        });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push({
            day: d,
            isCurrentMonth: true,
            date: new Date(year, month, d)
        });
    }

    // Next month leading days to fill grid (42 grid items = 6 rows)
    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
        calendarDays.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, month + 1, i)
        });
    }

    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (date) => {
        return formatDateKey(date) === selectedKey;
    };

    return (
        <div className="w-full min-h-screen bg-[#1b2028] text-white p-4 md:p-8 flex flex-col items-center">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700/60">
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide flex items-center gap-3">
                            <CalendarIcon className="text-emerald-400 w-8 h-8" />
                            Scheduler
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Organize and plan your daily tasks.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const today = new Date();
                            setCurrentDate(today);
                            setSelectedDate(today);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-all shadow-md shadow-emerald-900/20"
                    >
                        Today
                    </button>
                </div>

                {/* Main Grid: Calendar + Task Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Calendar View (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2 bg-[#232a35] border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-100">
                                {monthNames[month]} <span className="text-emerald-400">{year}</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-700/60 rounded-lg text-gray-300 hover:text-white transition"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-700/60 rounded-lg text-gray-300 hover:text-white transition"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Days of Week */}
                        <div className="grid grid-cols-7 text-center font-medium text-xs text-emerald-400 uppercase tracking-wider mb-2">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((item, idx) => {
                                const key = formatDateKey(item.date);
                                const dayTasks = tasks[key] || [];
                                const active = isSelected(item.date);
                                const today = isToday(item.date);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(item.date)}
                                        className={`min-h-17.5 p-2 rounded-xl flex flex-col justify-between text-left transition-all relative border ${!item.isCurrentMonth
                                            ? 'text-gray-600 border-transparent hover:bg-gray-800/30'
                                            : active
                                                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                                                : today
                                                    ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-300'
                                                    : 'bg-[#1b2028]/60 border-gray-700/40 text-gray-200 hover:bg-gray-700/40'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`text-sm font-semibold ${today ? 'bg-emerald-500 text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs' : ''}`}>
                                                {item.day}
                                            </span>
                                        </div>

                                        {/* Task count dots indicator */}
                                        {dayTasks.length > 0 && (
                                            <div className="flex items-center gap-1 mt-1 overflow-hidden">
                                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md font-medium truncate">
                                                    {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Task Panel Sidebar */}
                    <div className="bg-[#232a35] border border-gray-700/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                            {/* Selected Date Header */}
                            <div className="border-b border-gray-700/60 pb-4 mb-4">
                                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                    Tasks for
                                </p>
                                <h3 className="text-lg font-bold text-white mt-0.5">
                                    {selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </h3>
                            </div>

                            {/* Add Task Input */}
                            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Add a new task..."
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    className="flex-1 bg-[#1b2028] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition"
                                />
                                <button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition"
                                    title="Add Task"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </form>

                            {/* Task List */}
                            <div className="space-y-2 max-h-85 overflow-y-auto pr-1">
                                {selectedTasks.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 text-sm">
                                        No tasks scheduled for this day.
                                    </div>
                                ) : (
                                    selectedTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition ${task.completed
                                                ? 'bg-[#1b2028]/40 border-gray-800 text-gray-500 line-through'
                                                : 'bg-[#1b2028] border-gray-700/60 text-gray-200'
                                                }`}
                                        >
                                            <div
                                                onClick={() => toggleTask(task.id)}
                                                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 pr-2"
                                            >
                                                {task.completed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-500 shrink-0" />
                                                )}
                                                <span className="text-sm truncate">{task.text}</span>
                                            </div>
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="text-gray-500 hover:text-red-400 p-1 transition shrink-0"
                                                title="Delete task"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Footer Summary */}
                        <div className="pt-4 border-t border-gray-700/60 text-xs text-gray-400 flex justify-between items-center mt-4">
                            <span>
                                {selectedTasks.filter((t) => t.completed).length} of {selectedTasks.length} completed
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Schedule;