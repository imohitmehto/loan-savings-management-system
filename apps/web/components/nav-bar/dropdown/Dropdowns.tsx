export function NotificationsDropdown() {
  return (
    <div className="absolute right-0 top-full mt-2 bg-white text-slate-800 shadow-xl w-80 rounded-xl z-50 border border-slate-200 animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Notifications</h3>
        <p className="text-xs text-slate-500 mt-1">You have 3 unread notifications</p>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <div className="p-3 hover:bg-slate-50 transition-colors border-l-4 border-blue-400">
          <p className="text-sm font-medium">User A requested a loan</p>
          <p className="text-xs text-slate-500 mt-1">2 minutes ago</p>
        </div>
        <div className="p-3 hover:bg-slate-50 transition-colors border-l-4 border-green-400">
          <p className="text-sm font-medium">New account added</p>
          <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
        </div>
        <div className="p-3 hover:bg-slate-50 transition-colors border-l-4 border-purple-400">
          <p className="text-sm font-medium">Monthly report ready</p>
          <p className="text-xs text-slate-500 mt-1">3 hours ago</p>
        </div>
      </div>
      <div className="p-3 border-t border-slate-100">
        <button className="text-xs text-blue-500 font-medium hover:text-blue-600 transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
}

export function CalendarDropdown() {
  return (
    <div className="absolute right-0 top-full mt-2 bg-white text-slate-800 shadow-xl w-64 rounded-xl z-50 border border-slate-200 animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="p-4 text-center">
        <svg className="mx-auto mb-2 text-3xl text-slate-400" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" d="M5 8h14M7 4v4m10-4v4m-7 12h4"/>
        </svg>
        <p className="text-sm font-medium">Calendar Integration</p>
        <p className="text-xs text-slate-500 mt-1">Coming soon...</p>
      </div>
    </div>
  );
}

export function NotesDropdown() {
  return (
    <div className="absolute right-0 top-full mt-2 bg-white text-slate-800 shadow-xl w-80 rounded-xl z-50 border border-slate-200 animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-3">Quick Notes</h3>
        <textarea
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          rows={4}
          placeholder="Write a quick note..."
        ></textarea>
        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors">
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
