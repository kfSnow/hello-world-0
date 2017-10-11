
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class DrawShapes extends JFrame implements KeyListener {

    private static int SCALE = 4; // default that I like

    private final List<Shape> planets = new ArrayList<Shape>();
    private final List<Shape> ships = new ArrayList<Shape>();
    private final List<Shape> goals = new ArrayList<Shape>();
    private final JPanel jPanel;

    public DrawShapes() {
        setSize(new Dimension(SCALE * 160, SCALE * 120));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);

        jPanel = new JPanel() {
            @Override
            public void paintComponent(Graphics g) {
                paintPanel((Graphics2D) g);
            }
        };
        setTitle("My Shapes");
        this.getContentPane().add(jPanel);
        this.addKeyListener(this);
    }

    private void paintPanel(Graphics2D g) {
        Graphics2D g2 = g;

        g2.setColor(Color.blue);
        for (Shape ship : ships) {
            g2.fill(ship);
        }

        g2.setColor(Color.green);
        for (Shape goal : goals) {
            g2.fill(goal);
        }

        g2.setColor(Color.red);
        for (int i = 0; i < ships.size(); i++) {
            if (i < goals.size()) {

                Rectangle s = ships.get(i).getBounds();
                Rectangle t = goals.get(i).getBounds();
                Shape line = new Line2D.Double(s.getCenterX(), s.getCenterY(), t.getCenterX(), t.getCenterY());
                g2.draw(line);
            }
        }

        g2.setColor(Color.black);
        for (Shape planet : planets) {
            g2.draw(planet);
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        Point mousePosition = jPanel.getMousePosition();
        if (e.getKeyChar() > '0' && e.getKeyChar() <= '9') {
            int r = SCALE * (e.getKeyChar() - '0');
            addPlanets(mousePosition, r);
        } else if (e.getKeyChar() == 's') {
            addPoint(mousePosition, "ship");
        } else if (e.getKeyChar() == 'g') {
            addPoint(mousePosition, "goal");

        }
        this.repaint();
    }

    private void addPoint(Point mousePosition, String t) {
        System.out.printf("%s,%s,%s\n", t, mousePosition.x, mousePosition.y);
        if (t == "ship") {
            ships.add(new TriangleShape(mousePosition.x, mousePosition.y, 4));
        } else if (t == "goal") {
            goals.add(new Rectangle(mousePosition.x, mousePosition.y, 4, 4));
        }
    }

    private void addPlanets(Point mousePosition, int r) {
        int x = mousePosition.x - r;
        int y = mousePosition.y - r;
        System.out.printf("planet,%s,%s,%s\n", x, y, r);
        Ellipse2D.Double p1 = new Ellipse2D.Double(x, y, 2 * r, 2 * r);
        planets.add(p1);
        // add a symmetric one
        x = jPanel.getWidth() - mousePosition.x - r;
        y = jPanel.getHeight() - mousePosition.y - r;
        System.out.printf("planet,%s,%s,%s\n", x, y, r);
        Ellipse2D.Double p2 = new Ellipse2D.Double(x, y, 2 * r, 2 * r);
        planets.add(p2);
    }

    @Override
    public void keyPressed(KeyEvent e) {

    }

    @Override
    public void keyReleased(KeyEvent e) {

    }

    class TriangleShape extends Polygon {
        public TriangleShape(int x, int y, int s) {
            this.addPoint(x - s / 2, y - s / 2);
            this.addPoint(x, y + s / 2);
            this.addPoint(x + s / 2, y - s / 2);
        }

    }

    private static final long serialVersionUID = 1L;

    public static void main(String args[]) {

        for (int i = 0; i < args.length; i++) {
            String arg = args[i];
            switch (arg) {
                case "-scale":
                    SCALE = Integer.parseInt(args[++i]);
                    break;
            }
        }

        SwingUtilities.invokeLater(() -> new DrawShapes());
    }

}