#include <iostream>
#include <winsock2.h>
#include <string>
#include <vector>
#include <fstream>  // For File I/O
#include <sstream>
#include <algorithm>

#pragma comment(lib, "ws2_32.lib")

using namespace std;

// --- 1. DATA MODELS ---
struct Room {
    int id;
    string type;
    double price;
    bool isBooked;
    int bookedDays;
    string imageUrl; // NEW: Image Support
};

struct User {
    string username;
    string password;
    string role;
};

// --- 2. GLOBAL DATA ---
vector<Room> rooms; // Now loaded from file, not hardcoded
double totalIncome = 0.0; 

vector<User> users = {
    {"admin", "admin123", "admin"},
    {"staff", "staff123", "receptionist"}
};

// --- 3. DATABASE ENGINE (PERSISTENCE) ---

const string DB_FILE = "database.txt";

// Save everything to text file
void saveDatabase() {
    ofstream file(DB_FILE);
    if (file.is_open()) {
        // Line 1: Total Income
        file << totalIncome << endl;
        // Subsequent Lines: Room Data
        for (const auto& r : rooms) {
            file << r.id << "|" << r.type << "|" << r.price << "|" 
                 << r.isBooked << "|" << r.bookedDays << "|" << r.imageUrl << endl;
        }
        file.close();
        cout << "[DB] Data saved successfully.\n";
    }
}

// Load from text file
void loadDatabase() {
    ifstream file(DB_FILE);
    rooms.clear();
    
    if (file.is_open()) {
        string line;
        // Read Income
        if (getline(file, line)) totalIncome = stod(line);

        // Read Rooms
        while (getline(file, line)) {
            stringstream ss(line);
            string segment;
            vector<string> parts;
            while(getline(ss, segment, '|')) parts.push_back(segment);

            if (parts.size() >= 6) {
                Room r;
                r.id = stoi(parts[0]);
                r.type = parts[1];
                r.price = stod(parts[2]);
                r.isBooked = (parts[3] == "1");
                r.bookedDays = stoi(parts[4]);
                r.imageUrl = parts[5];
                rooms.push_back(r);
            }
        }
        file.close();
        cout << "[DB] Loaded " << rooms.size() << " rooms from file.\n";
    } else {
        // Default Data (First Run Only)
        cout << "[DB] No file found. Creating defaults.\n";
        rooms = {
            {101, "Single", 100.0, false, 0, "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500"},
            {102, "Double", 150.0, false, 0, "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500"},
            {201, "Suite", 300.0, false, 0, "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500"},
            {202, "Suite", 300.0, false, 0, "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500"}
        };
        saveDatabase();
    }
}

// --- 4. SERVER UTILS ---
void sendResponse(SOCKET clientSocket, string status, string contentType, string body) {
    string response = "HTTP/1.1 " + status + "\r\n"
                      "Access-Control-Allow-Origin: *\r\n"
                      "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n"
                      "Access-Control-Allow-Headers: Content-Type\r\n"
                      "Content-Type: " + contentType + "\r\n"
                      "Content-Length: " + to_string(body.length()) + "\r\n"
                      "Connection: close\r\n"
                      "\r\n" + body;
    send(clientSocket, response.c_str(), response.length(), 0);
}

// AI Helper
string toLower(string s) { transform(s.begin(), s.end(), s.begin(), ::tolower); return s; }
string getAIRecommendation(string q) {
    q = toLower(q);
    if (q.find("cheap") != string::npos) return "Room 101 (Single) is our cheapest option at $100.";
    if (q.find("family") != string::npos) return "The Suite (201) is perfect for families.";
    return "I can help with booking. Try asking for 'cheap rooms' or 'suites'.";
}

// --- 5. MAIN ---
int main() {
    loadDatabase(); // <--- Load data on startup

    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);
    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(8080);
    bind(serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr));
    listen(serverSocket, 10);

    cout << ">> HOTEL V4.0 (Persistence + Images) RUNNING ON PORT 8080\n";

    while (true) {
        SOCKET clientSocket = accept(serverSocket, NULL, NULL);
        char buffer[4096];
        int bytesReceived = recv(clientSocket, buffer, 4096, 0);
        if (bytesReceived <= 0) { closesocket(clientSocket); continue; }
        
        buffer[bytesReceived] = '\0';
        string request(buffer);

        if (request.find("OPTIONS") == 0) sendResponse(clientSocket, "204 No Content", "text/plain", "");
        
        else if (request.find("POST /api/login") != string::npos) {
            size_t bodyPos = request.find("\r\n\r\n");
            string body = request.substr(bodyPos + 4);
            size_t delim = body.find("|");
            string u = body.substr(0, delim), p = body.substr(delim + 1);
            string role = "guest";
            bool found = false;
            for(auto& usr : users) if(usr.username == u && usr.password == p) { role = usr.role; found = true; }
            if(found) sendResponse(clientSocket, "200 OK", "application/json", "{\"status\":\"success\", \"role\":\"" + role + "\"}");
            else sendResponse(clientSocket, "401 Unauthorized", "application/json", "{\"status\":\"fail\"}");
        }

        else if (request.find("GET /api/rooms") != string::npos) {
            string json = "{ \"income\": " + to_string(totalIncome) + ", \"rooms\": [";
            for (size_t i = 0; i < rooms.size(); ++i) {
                json += "{\"id\":" + to_string(rooms[i].id) + ",";
                json += "\"type\":\"" + rooms[i].type + "\",";
                json += "\"price\":" + to_string((int)rooms[i].price) + ",";
                json += "\"image\":\"" + rooms[i].imageUrl + "\","; // NEW FIELD
                json += "\"booked\":" + string(rooms[i].isBooked ? "true" : "false") + "}";
                if (i < rooms.size() - 1) json += ",";
            }
            json += "]}";
            sendResponse(clientSocket, "200 OK", "application/json", json);
        }

        else if (request.find("POST /api/book") != string::npos) {
            size_t bodyPos = request.find("\r\n\r\n");
            string body = request.substr(bodyPos + 4);
            size_t delim = body.find("|");
            int rId = stoi(body.substr(0, delim));
            int days = stoi(body.substr(delim + 1));
            
            bool success = false;
            for (auto& r : rooms) {
                if (r.id == rId && !r.isBooked) {
                    r.isBooked = true;
                    r.bookedDays = days;
                    totalIncome += r.price * days;
                    saveDatabase(); // <--- SAVE ON CHANGE
                    success = true;
                    break;
                }
            }
            if(success) sendResponse(clientSocket, "200 OK", "application/json", "{\"status\":\"success\"}");
            else sendResponse(clientSocket, "400 Bad Request", "application/json", "{\"status\":\"fail\"}");
        }

        else if (request.find("POST /api/cancel") != string::npos) {
            size_t bodyPos = request.find("\r\n\r\n");
            int rId = stoi(request.substr(bodyPos + 4));
            for (auto& r : rooms) {
                if (r.id == rId && r.isBooked) {
                    totalIncome -= r.price * r.bookedDays;
                    r.isBooked = false;
                    r.bookedDays = 0;
                    saveDatabase(); // <--- SAVE ON CHANGE
                    break;
                }
            }
            sendResponse(clientSocket, "200 OK", "application/json", "{\"status\":\"success\"}");
        }

        else if (request.find("POST /api/ai") != string::npos) {
            size_t bodyPos = request.find("\r\n\r\n");
            string reply = getAIRecommendation(request.substr(bodyPos + 4));
            sendResponse(clientSocket, "200 OK", "application/json", "{\"reply\":\"" + reply + "\"}");
        }

        closesocket(clientSocket);
    }
    return 0;
}
 // g++ server.cpp -o hotel_server -lws2_32
//  .\hotel_server.exe