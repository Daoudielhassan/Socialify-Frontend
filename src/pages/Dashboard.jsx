import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Mail,
  Phone,
  Send,
  Facebook,
  Archive,
  Reply,
  MoreHorizontal,
  ChevronDown,
  Download,
  Eye
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const goToInbox = () => {
    navigate("/inbox");
  };

  const goToAnalytics = () => {
    navigate("/analytics");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Sample data for charts
  const sentimentData = [
    { name: 'Jan', positive: 4000, negative: 2400, neutral: 2400 },
    { name: 'Feb', positive: 3000, negative: 1398, neutral: 2210 },
    { name: 'Mar', positive: 2000, negative: 9800, neutral: 2290 },
    { name: 'Apr', positive: 2780, negative: 3908, neutral: 2000 },
    { name: 'May', positive: 1890, negative: 4800, neutral: 2181 },
    { name: 'Jun', positive: 2390, negative: 3800, neutral: 2500 },
  ];

  const messageClassificationData = [
    { name: 'Urgent', value: 30, color: '#10B981' },
    { name: 'Important', value: 45, color: '#EF4444' },
    { name: 'Not Important', value: 25, color: '#F59E0B' },
  ];

  const volumeTrendsData = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 150 },
    { name: 'Wed', value: 180 },
    { name: 'Thu', value: 140 },
    { name: 'Fri', value: 200 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 70 },
  ];

  const personalVsBusinessData = [
    { name: 'Mon', personal: 80, business: 120 },
    { name: 'Tue', personal: 90, business: 140 },
    { name: 'Wed', personal: 100, business: 160 },
    { name: 'Thu', personal: 85, business: 130 },
    { name: 'Fri', personal: 110, business: 180 },
    { name: 'Sat', personal: 60, business: 80 },
    { name: 'Sun', personal: 50, business: 60 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">SocialifyIA</span>
            </div>
            <nav className="flex space-x-6">
              <button className="text-gray-900 font-medium border-b-2 border-blue-600 pb-2">Dashboard</button>
              <button onClick={goToInbox} className="text-gray-500 hover:text-gray-900">Inbox</button>
              <button onClick={goToAnalytics} className="text-gray-500 hover:text-gray-900">Analytics</button>
              <button onClick={goToSettings} className="text-gray-500 hover:text-gray-900">Settings</button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Customize AI</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total Unread</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2,345</div>
            <div className="text-sm text-gray-500 mb-3">from 45 individual platforms</div>
            <button className="text-blue-600 text-sm hover:underline flex items-center space-x-1">
              <span>View Details</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Positive Sentiment</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">88%</div>
            <div className="text-sm text-gray-500 mb-3">increase from last month</div>
            <button className="text-blue-600 text-sm hover:underline flex items-center space-x-1">
              <span>View Details</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">AI Confidence Score</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
            <div className="text-sm text-gray-500 mb-3">based on AI analysis accuracy</div>
            <button className="text-blue-600 text-sm hover:underline flex items-center space-x-1">
              <span>View Details</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Urgent</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">10</div>
            <div className="text-sm text-gray-500 mb-3">Not Important</div>
            <button className="text-blue-600 text-sm hover:underline flex items-center space-x-1">
              <span>View Details</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-gray-600">60 Personal vs. 40 Business</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Messages</div>
            <div className="text-sm text-gray-500 mb-3">Distribution</div>
            <button className="text-blue-600 text-sm hover:underline flex items-center space-x-1">
              <span>View Details</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Communications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Communications</h2>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <span>All</span>
                  <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">94</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-1 text-gray-600 rounded-full text-sm hover:bg-gray-100">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                  <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">5</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-1 text-gray-600 rounded-full text-sm hover:bg-gray-100">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp</span>
                  <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">3</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-1 text-gray-600 rounded-full text-sm hover:bg-gray-100">
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                  <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">6</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-1 text-gray-600 rounded-full text-sm hover:bg-gray-100">
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Communication Item 1 */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">AJ</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">Alice Johnson</span>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Urgent & Business</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">AI: 95%</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Neutral</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Important</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Follow-up on project proposal</p>
                  <p className="text-sm text-gray-500 mb-3">Hi, just wanted to follow up on the project proposal we discussed last week.</p>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-blue-600 text-sm hover:underline">
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 text-sm hover:underline">
                      <Archive className="w-4 h-4" />
                      <span>Archive</span>
                    </button>
                    <button className="text-gray-600 text-sm hover:underline">Mark Incorrect</button>
                  </div>
                </div>
              </div>

              {/* Communication Item 2 */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-between">
                  <span className="text-green-600 font-medium text-sm">BG</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">Bob Group Chat</span>
                    <span className="text-xs text-gray-500">5 min ago</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Personal & Social</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">AI: 85%</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Positive</span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Not Important</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Weekend Plans</p>
                  <p className="text-sm text-gray-500 mb-3">Hey everyone, what are the plans for the weekend? Thinking of hiking.</p>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-blue-600 text-sm hover:underline">
                      <MessageSquare className="w-4 h-4" />
                      <span>View Chat</span>
                    </button>
                    <button className="text-gray-600 text-sm hover:underline">Mark Incorrect</button>
                  </div>
                </div>
              </div>

              {/* Communication Item 3 */}
              <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-medium text-sm">CT</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">Charlie Tech Support</span>
                    <span className="text-xs text-gray-500">10 min ago</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Urgent & Business</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">AI: 95%</span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Negative</span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Urgent</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Urgent: Server Down</p>
                  <p className="text-sm text-gray-500 mb-3">Our main server is down. We are investigating the issue immediately. ETA 15min.</p>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-blue-600 text-sm hover:underline">
                      <span>Notify Team</span>
                    </button>
                    <button className="flex items-center space-x-1 text-blue-600 text-sm hover:underline">
                      <span>Escalate</span>
                    </button>
                    <button className="text-gray-600 text-sm hover:underline">Mark Incorrect</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="space-y-6">
            {/* Sentiment Analysis Trend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis Trend</h3>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>All Platforms</option>
                  </select>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Message Classification */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Message Classification</h3>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>All Platforms</option>
                  </select>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={messageClassificationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {messageClassificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {messageClassificationData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Volume Trends Over Week */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Volume Trends Over Week</h3>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>All Platforms</option>
                </select>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Personal vs Business Messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal vs Business Messages</h3>
              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>All Platforms</option>
                </select>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personalVsBusinessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="personal" fill="#EF4444" />
                  <Bar dataKey="business" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Personal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Business</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Integrations and Quick Reply Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Platform Integrations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Integrations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-sm text-green-600">Connected</div>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">WhatsApp</div>
                    <div className="text-sm text-green-600">Connected</div>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Send className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Telegram</div>
                    <div className="text-sm text-yellow-600">Pending</div>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Facebook className="w-6 h-6 text-blue-700" />
                  <div>
                    <div className="font-medium text-gray-900">Facebook</div>
                    <div className="text-sm text-red-600">Disconnected</div>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Quick Reply Templates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Reply Templates</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">Standard Greeting</div>
                <div className="text-sm text-gray-600 mb-3">Hello! Thank you for reaching out. How can I assist you today?</div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Use Template</button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">Sales Inquiry Follow-up</div>
                <div className="text-sm text-gray-600 mb-3">Thank you for your interest in our products. Would you like a demo or more information?</div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Use Template</button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">Billing Issue Acknowledgment</div>
                <div className="text-sm text-gray-600 mb-3">We have received your billing inquiry and are looking into it. We will get back to you within 24 hours.</div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Use Template</button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">Positive Feedback Response</div>
                <div className="text-sm text-gray-600 mb-3">We are thrilled to hear you had a great experience! Your feedback is highly valued.</div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Use Template</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">© 2025 SocialifyIA. All rights reserved.</div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <span className="text-sm text-gray-400">Made with</span>
            <div className="ml-2 text-blue-600 font-semibold">Visily</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;

