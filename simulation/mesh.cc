#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
#include "ns3/netanim-module.h"
#include "ns3/mobility-module.h"
#include "ns3/flow-monitor-module.h"
#include "ns3/error-model.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("PartialMesh50Users");

int
main(int argc, char *argv[])
{
    std::string dataRate = "20Mbps";
    std::string delay = "5ms";
    std::string errorRateStr = "0.01";
    std::string queueSizeStr = "1000p";
    std::string bitrateStr = "1Mbps";
    
    CommandLine cmd;
    cmd.AddValue("dataRate", "Data rate for the links", dataRate);
    cmd.AddValue("delay", "Delay for the links", delay);
    cmd.AddValue("errorRate", "Packet drop error rate", errorRateStr);
    cmd.AddValue("queueSize", "Queue size (packets)", queueSizeStr);
    cmd.AddValue("bitrate", "Streaming bitrate", bitrateStr);
    cmd.Parse(argc, argv);

    double errorRate = std::stod(errorRateStr);

    // -----------------------------
    // CREATE 50 USERS
    // -----------------------------
    NodeContainer users;
    users.Create(50);

    // -----------------------------
    // MOBILITY
    // -----------------------------
    MobilityHelper mobility;
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(users);

    // -----------------------------
    // LINK CONFIGURATION
    // -----------------------------
    PointToPointHelper p2p;
    p2p.SetDeviceAttribute("DataRate", StringValue(dataRate));
    p2p.SetChannelAttribute("Delay", StringValue(delay));
    p2p.SetQueue("ns3::DropTailQueue", "MaxSize", StringValue(queueSizeStr));

    // -----------------------------
    // INTERNET STACK
    // -----------------------------
    InternetStackHelper stack;
    stack.Install(users);

    // -----------------------------
    // DEVICE STORAGE
    // -----------------------------
    std::vector<NetDeviceContainer> devices;
    Ipv4AddressHelper address;
    uint32_t subnetCount = 1;

    // -----------------------------
    // PARTIAL MESH CONNECTIONS
    // -----------------------------
    for (uint32_t i = 0; i < 50; i++)
    {
        for (uint32_t j = 1; j <= 3; j++)
        {
            uint32_t neighbor = (i + j) % 50;

            NetDeviceContainer d = p2p.Install(users.Get(i), users.Get(neighbor));
            devices.push_back(d);

            std::ostringstream subnet;
            subnet << "10.1." << subnetCount++ << ".0";
            address.SetBase(subnet.str().c_str(), "255.255.255.0");
            address.Assign(d);
        }
    }

    // -----------------------------
    // ERROR MODEL
    // -----------------------------
    Ptr<RateErrorModel> em = CreateObject<RateErrorModel>();
    em->SetAttribute("ErrorRate", DoubleValue(errorRate));
    for (uint32_t i = 0; i < devices.size(); i++)
    {
        devices[i].Get(1)->SetAttribute("ReceiveErrorModel", PointerValue(em));
    }

    // -----------------------------
    // ROUTING
    // -----------------------------
    Ipv4GlobalRoutingHelper::PopulateRoutingTables();

    // -----------------------------
    // APPLICATIONS
    // -----------------------------
    uint16_t port = 9;

    // Packet sink on all nodes
    for (uint32_t i = 0; i < 50; i++)
    {
        PacketSinkHelper sinkHelper("ns3::UdpSocketFactory", InetSocketAddress(Ipv4Address::GetAny(), port));
        ApplicationContainer sinkApp = sinkHelper.Install(users.Get(i));
        sinkApp.Start(Seconds(0.0));
        sinkApp.Stop(Seconds(10.0));
    }

    // Traffic generation
    for (uint32_t i = 0; i < 50; i++)
    {
        uint32_t target = (i + 5) % 50;

        Ptr<Ipv4> ipv4 = users.Get(target)->GetObject<Ipv4>();
        Ipv4Address targetIp = ipv4->GetAddress(1, 0).GetLocal();

        OnOffHelper traffic("ns3::UdpSocketFactory", InetSocketAddress(targetIp, port));
        traffic.SetAttribute("DataRate", StringValue(bitrateStr));
        traffic.SetAttribute("PacketSize", UintegerValue(1024));

        ApplicationContainer app = traffic.Install(users.Get(i));
        app.Start(Seconds(1.0 + i * 0.1));
        app.Stop(Seconds(10.0));
    }

    // -----------------------------
    // FLOWMONITOR
    // -----------------------------
    FlowMonitorHelper flowmonHelper;
    Ptr<FlowMonitor> flowmon = flowmonHelper.InstallAll();

    // -----------------------------
    // NETANIM
    // -----------------------------
    AnimationInterface anim("mesh50.xml");
    anim.SetMaxPktsPerTraceFile(500000);

    // Positions
    double angleStep = 360.0 / 50.0;
    double radius = 50.0;

    for (uint32_t i = 0; i < 50; i++)
    {
        double angle = angleStep * i;
        double rad = angle * M_PI / 180.0;
        double x = 60 + radius * cos(rad);
        double y = 60 + radius * sin(rad);

        anim.SetConstantPosition(users.Get(i), x, y);
        std::ostringstream name;
        name << "U" << i;
        anim.UpdateNodeDescription(users.Get(i), name.str());
    }

    // -----------------------------
    // RUN SIMULATION
    // -----------------------------
    Simulator::Stop(Seconds(10.0));
    NS_LOG_UNCOND("Partial Mesh Topology with 50 Users Running...");
    Simulator::Run();

    flowmon->SerializeToXmlFile("flowmon.xml", true, true);

    Simulator::Destroy();
    return 0;
}
